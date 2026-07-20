import os
import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List, Dict, Any
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# Setup basic logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

email_port = int(os.getenv("EMAIL_PORT", 465))
use_starttls = email_port == 587
use_ssl = email_port == 465

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),
    MAIL_FROM=os.getenv("EMAIL_FROM"),
    MAIL_PORT=email_port,
    MAIL_SERVER=os.getenv("EMAIL_SERVER", "smtp.gmail.com"),
    MAIL_FROM_NAME="Aaj Tech Trading",
    MAIL_STARTTLS=use_starttls,
    MAIL_SSL_TLS=use_ssl,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_enquiry_notification(admin_email: str, enquiry_data: Dict[str, Any]):
    """Sends an email to the admin with enquiry details."""
    inquiry_type = enquiry_data.get('inquiryType', 'General Inquiry')
    is_order = inquiry_type in ["Product Quotation", "Order Inquiry", "Shipping & Logistics", "Cart Inquiry", "Product Order Inquiry"]
    
    title = "New Order Inquiry" if is_order else "New General Inquiry"
    header_color = "#D2232A" # Brand Red
    
    # Build details table
    rows = [
        ("Full Name", enquiry_data.get('fullName')),
        ("Email", enquiry_data.get('email')),
        ("Phone", enquiry_data.get('phone')),
        ("Inquiry Type", inquiry_type),
    ]
    
    if is_order:
        if enquiry_data.get('productName') and not enquiry_data.get('items'):
            rows.append(("Product", enquiry_data.get('productName')))
        if enquiry_data.get('quantity') and not enquiry_data.get('items'):
            rows.append(("Quantity", enquiry_data.get('quantity')))
            
        if enquiry_data.get('totalPrice'):
            total_val = enquiry_data.get('totalPrice')
            if not enquiry_data.get('items'):  # Only for single product inquiry
                try:
                    total_val = float(total_val)
                    base_val = total_val / 1.18
                    gst_val = total_val - base_val
                    rows.append(("Base Subtotal", f"₹{base_val:,.2f}"))
                    rows.append(("GST (18%)", f"₹{gst_val:,.2f}"))
                    rows.append(("Total Price (Incl. GST)", f"₹{total_val:,.2f}"))
                except (ValueError, TypeError):
                    rows.append(("Total Price (Incl. GST)", f"₹{total_val}"))
            else:
                rows.append(("Estimated Grand Total", f"₹{total_val}"))
    
    rows.append(("Message", enquiry_data.get('message')))
    
    table_html = "".join([
        f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>{label}:</td>"
        f"<td style='padding: 10px; border-bottom: 1px solid #eee;'>{value}</td></tr>"
        for label, value in rows if value
    ])

    # Build cart items table if present
    items_html = ""
    items = enquiry_data.get('items')
    if items and isinstance(items, list):
        items_rows = []
        for item in items:
            name = item.get('name', 'N/A')
            qty = item.get('quantity', 0)
            price = item.get('price', 0.0)
            total = qty * price
            items_rows.append(
                f"<tr style='border-bottom: 1px solid #eee;'>"
                f"<td style='padding: 10px; text-align: left;'>{name}</td>"
                f"<td style='padding: 10px; text-align: center;'>{qty}</td>"
                f"<td style='padding: 10px; text-align: right;'>₹{price:,.2f}</td>"
                f"<td style='padding: 10px; text-align: right; font-weight: bold;'>₹{total:,.2f}</td>"
                f"</tr>"
            )
        base_total = sum(item.get('quantity', 0) * item.get('price', 0.0) for item in items)
        gst_amount = base_total * 0.18
        grand_total = base_total + gst_amount
        
        items_rows.append(
            f"<tr style='border-top: 2px solid #eee; font-weight: bold;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right; color: #666;'>Base Subtotal:</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{base_total:,.2f}</td>"
            f"</tr>"
            f"<tr style='font-weight: bold;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right; color: #666;'>GST (18%):</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{gst_amount:,.2f}</td>"
            f"</tr>"
            f"<tr style='background-color: #fdf2f2; font-weight: bold; font-size: 16px; color: #D2232A; border-top: 2px solid #D2232A;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right;'>Grand Total (Incl. GST):</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{grand_total:,.2f}</td>"
            f"</tr>"
        )
        
        items_html = (
            f"<p style='font-size: 16px; font-weight: bold; color: #D2232A; margin-top: 25px;'>Requested Cart Items:</p>"
            f"<table style='width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #fcfcfc; font-size: 14px;'>"
            f"<thead><tr style='background-color: #f4f4f4; border-bottom: 2px solid #eee;'>"
            f"<th style='padding: 10px; text-align: left;'>Product</th>"
            f"<th style='padding: 10px; text-align: center;'>Qty</th>"
            f"<th style='padding: 10px; text-align: right;'>Unit Price</th>"
            f"<th style='padding: 10px; text-align: right;'>Total</th>"
            f"</tr></thead>"
            f"<tbody>{''.join(items_rows)}</tbody>"
            f"</table>"
        )

    html = f"""
    <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background-color: #2D3436; padding: 25px; text-align: center; border-bottom: 5px solid #D2232A;">
                    <h1 style="color: white; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">⚡ {title} REMINDER</h1>
                </div>
                <div style="padding: 30px;">
                    <div style="background-color: #FFF9C4; padding: 15px; border-radius: 8px; border: 1px solid #FBC02D; margin-bottom: 25px;">
                        <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ ACTION REQUIRED:</p>
                        <p style="margin: 5px 0 0 0; color: #856404; font-size: 14px;">Please review this {inquiry_type} and contact the lead within 24 hours.</p>
                    </div>
 
                    <p style="font-size: 16px; font-weight: bold; color: #D2232A;">Lead Information:</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #fcfcfc;">
                        {table_html}
                    </table>

                    {items_html}
 
                    <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 14px; color: #636e72;"><strong>Pro Tip:</strong> You can click the email address above to reply directly to the customer.</p>
                        <a href="mailto:{enquiry_data.get('email')}?subject=Re: Your {inquiry_type} to Aaj Tech Trading" 
                           style="display: inline-block; background-color: #D2232A; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
                           Reply to Customer Now
                        </a>
                    </div>
                </div>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #95a5a6;">
                    System ID: {enquiry_data.get('_id', 'NEW')} | Generated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                </div>
            </div>
        </body>
    </html>
    """
    
    if not admin_email:
        logger.warning("Admin email is not configured. Skipping enquiry notification.")
        return
 
    try:
        message = MessageSchema(
            subject=f"{title}: {enquiry_data.get('fullName')}",
            recipients=[admin_email],
            body=html,
            subtype=MessageType.html
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"Enquiry notification sent successfully to {admin_email}")
    except Exception as e:
        logger.error(f"Failed to send enquiry notification to {admin_email}: {str(e)}")
 
async def send_auto_reply(user_email: str, enquiry_data: Dict[str, Any]):
    """Sends a confirmation email to the user who submitted the enquiry."""
    user_name = enquiry_data.get('fullName', 'Customer')
    inquiry_type = enquiry_data.get('inquiryType', 'Inquiry')
    is_order = inquiry_type in ["Product Quotation", "Order Inquiry", "Shipping & Logistics", "Cart Inquiry", "Product Order Inquiry"]
    
    subject = "Quotation Request Received - Aaj Tech Trading" if is_order else "Inquiry Received - Aaj Tech Trading"
    hero_text = "Your Request is Being Processed" if is_order else "Thank You for Contacting Us"
 
    # Build cart items table if present
    items_html = ""
    items = enquiry_data.get('items')
    if items and isinstance(items, list):
        items_rows = []
        for item in items:
            name = item.get('name', 'N/A')
            qty = item.get('quantity', 0)
            price = item.get('price', 0.0)
            total = qty * price
            items_rows.append(
                f"<tr style='border-bottom: 1px solid #eee;'>"
                f"<td style='padding: 10px; text-align: left;'>{name}</td>"
                f"<td style='padding: 10px; text-align: center;'>{qty}</td>"
                f"<td style='padding: 10px; text-align: right;'>₹{price:,.2f}</td>"
                f"<td style='padding: 10px; text-align: right; font-weight: bold;'>₹{total:,.2f}</td>"
                f"</tr>"
            )
        base_total = sum(item.get('quantity', 0) * item.get('price', 0.0) for item in items)
        gst_amount = base_total * 0.18
        grand_total = base_total + gst_amount
        
        items_rows.append(
            f"<tr style='border-top: 2px solid #eee; font-weight: bold;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right; color: #666;'>Base Subtotal:</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{base_total:,.2f}</td>"
            f"</tr>"
            f"<tr style='font-weight: bold;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right; color: #666;'>GST (18%):</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{gst_amount:,.2f}</td>"
            f"</tr>"
            f"<tr style='background-color: #fdf2f2; font-weight: bold; font-size: 16px; color: #D2232A; border-top: 2px solid #D2232A;'>"
            f"<td colspan='3' style='padding: 10px; text-align: right;'>Grand Total (Incl. GST):</td>"
            f"<td style='padding: 10px; text-align: right;'>₹{grand_total:,.2f}</td>"
            f"</tr>"
        )
        
        items_html = (
            f"<p style='font-size: 16px; font-weight: bold; color: #D2232A; margin-top: 25px;'>Your Requested Items:</p>"
            f"<table style='width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #fcfcfc; font-size: 14px;'>"
            f"<thead><tr style='background-color: #f4f4f4; border-bottom: 2px solid #eee;'>"
            f"<th style='padding: 10px; text-align: left;'>Product</th>"
            f"<th style='padding: 10px; text-align: center;'>Qty</th>"
            f"<th style='padding: 10px; text-align: right;'>Unit Price</th>"
            f"<th style='padding: 10px; text-align: right;'>Total</th>"
            f"</tr></thead>"
            f"<tbody>{''.join(items_rows)}</tbody>"
            f"</table>"
        )
    
    single_pricing_html = ""
    if not items and is_order and enquiry_data.get('totalPrice'):
        try:
            total_val = float(enquiry_data.get('totalPrice'))
            base_val = total_val / 1.18
            gst_val = total_val - base_val
            single_pricing_html = (
                f"<p style='font-size: 16px; font-weight: bold; color: #D2232A; margin-top: 25px;'>Pricing Summary:</p>"
                f"<table style='width: 100%; border-collapse: collapse; margin: 15px 0; background-color: #fcfcfc; font-size: 14px; border: 1px solid #eee;'>"
                f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Product:</td><td style='padding: 10px; border-bottom: 1px solid #eee;'>{enquiry_data.get('productName')}</td></tr>"
                f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>Quantity:</td><td style='padding: 10px; border-bottom: 1px solid #eee;'>{enquiry_data.get('quantity')} units</td></tr>"
                f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>Base Subtotal:</td><td style='padding: 10px; border-bottom: 1px solid #eee;'>₹{base_val:,.2f}</td></tr>"
                f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>GST (18%):</td><td style='padding: 10px; border-bottom: 1px solid #eee;'>₹{gst_val:,.2f}</td></tr>"
                f"<tr style='background-color: #fdf2f2; font-weight: bold; color: #D2232A;'><td style='padding: 10px;'>Grand Total (Incl. GST):</td><td style='padding: 10px;'>₹{total_val:,.2f}</td></tr>"
                f"</table>"
            )
        except (ValueError, TypeError):
            pass

    html = f"""
    <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 0; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #D2232A; padding: 30px; text-align: center;">
                    <h2 style="color: white; margin: 0;">{hero_text}</h2>
                </div>
                <div style="padding: 30px;">
                    <p>Dear {user_name},</p>
                    <p>We have received your <strong>{inquiry_type}</strong>. Our team is reviewing the details and will get back to you within 4-6 business hours.</p>
                    
                    <div style="border-left: 4px solid #D2232A; background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #D2232A;">Summary of Submission:</p>
                        <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">"{enquiry_data.get('message')}"</p>
                    </div>

                    {single_pricing_html}

                    {items_html}
 
                    <p>If you have any urgent requirements, please feel free to reply to this email or call us at +91-9910009227.</p>
                    <p>Best Regards,<br><strong>Team Aaj Tech Trading</strong></p>
                </div>
                <div style="border-top: 1px solid #eee; padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
                    &copy; 2024 Aaj Tech Trading. Y-39, Okhla Phase II, New Delhi.
                </div>
            </div>
        </body>
    </html>
    """
    
    if not user_email:
        logger.warning("User email is not provided. Skipping auto-reply.")
        return
 
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[user_email],
            body=html,
            subtype=MessageType.html
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"Auto-reply email sent successfully to {user_email}")
    except Exception as e:
        logger.error(f"Failed to send auto-reply to {user_email}: {str(e)}")

async def send_welcome_email(user_email: str, user_name: str, reset_link: str):
    """Sends a welcome email to a newly signed-up user."""
    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #D2232A;">Welcome to Aaj Tech Trading</h2>
                <p>Dear {user_name},</p>
                <p>Your account has been created successfully. To get started and secure your account, please set your password using the link below:</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="background-color: #D2232A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set My Password</a>
                </p>
                <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #888;">{reset_link}</p>
                <p>Best Regards,<br>Team Aaj Tech Trading</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #888;">&copy; 2024 Aaj Tech Trading. All rights reserved.</p>
            </div>
        </body>
    </html>
    """
    
    if not user_email:
        logger.warning("User email is not provided. Skipping welcome email.")
        return

    try:
        message = MessageSchema(
            subject="Welcome to Aaj Tech Trading - Complete Your Setup",
            recipients=[user_email],
            body=html,
            subtype=MessageType.html
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(f"Welcome email sent successfully to {user_email}")
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")
