# Fix EmailJS Template Variables

## 🔧 Update Your EmailJS Template

Your form now sends these fields:
- `from_name` - Customer's name
- `reply_to` - Customer's email
- `message` - Customer's message

## 📝 Update Template in EmailJS Dashboard

1. Go to: https://dashboard.emailjs.com/admin/templates
2. Find template: `template_fw9hhw2`
3. Click **Edit**

### Update Your Template Content:

**Subject:**
```
New Contact Form Message from {{from_name}}
```

**Body (Replace your current template with this):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
        }
        .value {
            color: #333;
            font-size: 16px;
            margin-top: 5px;
            word-wrap: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Form Message</h1>
            <p>PrintNSupply Contact Form Submission</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">👤 Customer Name</div>
                <div class="value">{{from_name}}</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email Address</div>
                <div class="value">{{reply_to}}</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message</div>
                <div class="value">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>✉️ This message was sent from PrintNSupply Contact Form</p>
            <p>Reply directly to <strong>{{reply_to}}</strong> to respond to the customer</p>
        </div>
    </div>
</body>
</html>
```

### Alternative Simple Plain Text Template:
```
📬 New Contact Form Submission - PrintNSupply
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CUSTOMER NAME:
{{from_name}}

📧 EMAIL ADDRESS:
{{reply_to}}

💬 MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{message}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This message was sent from PrintNSupply Contact Form.
Reply directly to {{reply_to}} to respond to the customer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 PrintNSupply
📞 +1 (555) 123-4567
📧 PrintNSupply@gmail.com
```

### Important Settings:

**Reply To Field:**
Set this to: `{{reply_to}}`

This allows you to click "Reply" in your email and it will automatically reply to the customer's email address.

### Variable Names (Must Match Exactly):
- `{{from_name}}` - Customer's name
- `{{reply_to}}` - Customer's email  
- `{{message}}` - Customer's message

## ✅ After Updating Template:

1. Click **"Save"** 
2. Click **"Test It"** button
3. Enter test values:
   - from_name: John Doe
   - reply_to: john@example.com
   - message: This is a test message
4. Send test email
5. Check your inbox!

## 🧪 Test the Live Form:

1. Go to: http://localhost:5174/contact
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Message: Test message from contact form
3. Click "Send Message"
4. You should see green success toast
5. Check your email - you should now see:
   - ✅ Customer Name: Your Name
   - ✅ Email Address: your@email.com  
   - ✅ Message: Test message from contact form

## 📊 What Changed:

### Before (Incorrect):
```
Name: {{name}}        ❌ Wrong variable name
Email: {{email}}      ❌ Wrong variable name
```

### After (Correct):
```
Name: {{from_name}}   ✅ Matches form field
Email: {{reply_to}}   ✅ Matches form field
Message: {{message}}  ✅ Matches form field
```

## 🎯 Current Configuration:

**Form Fields (frontend/src/ContactUs.tsx):**
- `from_name` → Customer's name
- `reply_to` → Customer's email
- `message` → Customer's message

**EmailJS Settings:**
- Service ID: `service_pji711e`
- Template ID: `template_fw9hhw2`
- Public Key: `pNve9185cw30hDUqv`

**Template Variables (must match):**
- `{{from_name}}`
- `{{reply_to}}`
- `{{message}}`

---

**Everything is now configured correctly!** Just update your EmailJS template with the correct variable names and test! 🚀
