import os
import sys

def build_pdf():
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    except ImportError:
        print("Error: ReportLab is not installed or available.")
        sys.exit(1)

    os.makedirs("../docs", exist_ok=True)
    pdf_path = "../docs/sql-injection-guide.pdf"

    # Setup document
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=15,
        alignment=TA_CENTER
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'DocHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=20,
        textColor=colors.HexColor('#1e3a8a'),
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )
    
    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=5
    )

    callout_style = ParagraphStyle(
        'DocCallout',
        parent=styles['Normal'],
        fontName='Helvetica-BoldOblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#991b1b'),
        spaceAfter=5
    )

    story = []

    # 1. HEADER BANNER
    header_data = [
        [Paragraph("<font color='#00f2fe'><b>WEB SECURITY LABS</b></font>", ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor('#00f2fe'), alignment=TA_CENTER))]
    ]
    header_table = Table(header_data, colWidths=[500])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0b0f19')),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 20))

    # Title & Subtitle
    story.append(Paragraph("Beginner's Guide to SQL Injection", title_style))
    story.append(Paragraph("Understanding, Demonstrating, and Preventing SQLi Vulnerabilities", subtitle_style))
    story.append(Spacer(1, 10))

    # 2. WHAT IS SQL INJECTION
    story.append(Paragraph("1. What is SQL Injection (SQLi)?", heading_style))
    intro_text = (
        "<b>SQL Injection (SQLi)</b> is a common web security vulnerability that allows an attacker to "
        "interfere with the queries an application makes to its database. It occurs when untrusted user input "
        "is concatenated directly into a structured database query without proper sanitization or parameterization. "
        "This allows the input to break out of the intended data context and enter the command execution context, "
        "tricking the SQL interpreter into executing unintended, malicious database commands."
    )
    story.append(Paragraph(intro_text, body_style))

    # 3. HOW IT WORKS
    story.append(Paragraph("2. How It Works", heading_style))
    how_works_text = (
        "SQL databases interpret query commands based on syntax markers, such as quotes and semicolons. When an application "
        "takes user text and plugs it directly into a query string, the database cannot distinguish between the structure "
        "of the query (written by developers) and the input variables (entered by users).<br/><br/>"
        "Consider a dynamic search feature where the query is constructed like this:"
    )
    story.append(Paragraph(how_works_text, body_style))
    
    # Insecure query display
    ins_query_table = Table([[Paragraph("<b>Vulnerable Query Assembly:</b><br/>"
                                         "<font face='Courier'>query = \"SELECT * FROM products WHERE category = '\" + userInput + \"'\"</font>", code_style)]],
                            colWidths=[504])
    ins_query_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fee2e2')),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor('#fca5a5')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(ins_query_table)
    story.append(Spacer(1, 10))

    # Explaining the bypass payload
    story.append(Paragraph("3. Analyzing the Classic Bypass Payload", heading_style))
    payload_intro = (
        "In a login bypass scenario, an application checks authentication via username and password inputs. "
        "If a user provides a payload specifically crafted with database special characters (like quotes), they can re-shape the syntax."
    )
    story.append(Paragraph(payload_intro, body_style))
    
    # Payload breakdown table
    payload_data = [
        [Paragraph("<b>Payload:</b>", body_style), Paragraph("<font face='Courier'>' OR '1'='1</font>", code_style)],
        [Paragraph("<b>Username Field:</b>", body_style), Paragraph("<font face='Courier'>admin' OR '1'='1</font>", code_style)],
        [Paragraph("<b>Password Field:</b>", body_style), Paragraph("<i>(Can be left empty)</i>", body_style)]
    ]
    payload_table = Table(payload_data, colWidths=[150, 354])
    payload_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(payload_table)
    story.append(Spacer(1, 10))

    # Explaining the execution structure
    exec_explain = (
        "When the database runs the query, it interprets the single quote (<font face='Courier'>'</font>) in the input "
        "as the closing boundary of the string. The subsequent characters <font face='Courier'>OR '1'='1</font> are evaluated as "
        "logical instructions. Since the expression <font face='Courier'>'1'='1'</font> is always <b>TRUE</b>, the entire search condition "
        "simplifies to <b>TRUE</b>, bypassing the password validation requirement and returning the first record in the database—typically "
        "the administrator account."
    )
    story.append(Paragraph(exec_explain, body_style))
    
    # Add a PageBreak to transition to Prevention and Diagrams
    story.append(PageBreak())

    # 4. SIMPLE FLOW DIAGRAM
    story.append(Paragraph("4. Request Flow & Syntax Manipulation", heading_style))
    
    diagram_data = [
        [Paragraph("<b>[ User Browser ]</b><br/>Enters payload: <font face='Courier'>admin' OR '1'='1</font>", body_style)],
        [Paragraph("<b>&darr;</b> (Sends HTTP Request to Web Server)", ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER))],
        [Paragraph("<b>[ Web Application ]</b><br/>Concatenates raw string directly into SQL template", body_style)],
        [Paragraph("<b>&darr;</b> (Sends Insecure Query to SQL Interpreter)", ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER))],
        [Paragraph("<b>[ SQL Database Engine ]</b><br/>"
                   "Executes: <font face='Courier'>SELECT * FROM users WHERE user='admin' OR <b>'1'='1'</b> AND pass=''</font><br/>"
                   "Result: Bypasses check because <font face='Courier'>'1'='1'</font> is always TRUE.", body_style)],
        [Paragraph("<b>&darr;</b> (Returns Admin Account Data)", ParagraphStyle('Center', parent=body_style, alignment=TA_CENTER))],
        [Paragraph("<b>[ User Dashboard ]</b><br/>User gains unauthorized access!", body_style)]
    ]
    
    diagram_table = Table(diagram_data, colWidths=[504])
    diagram_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor('#fee2e2')),
        ('BACKGROUND', (0,4), (0,4), colors.HexColor('#fef08a')),
        ('BACKGROUND', (0,6), (0,6), colors.HexColor('#dcfce7')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(diagram_table)
    story.append(Spacer(1, 15))

    # 5. RISKS AND IMPACTS
    story.append(Paragraph("5. Primary Risks & Impacts", heading_style))
    risks_intro = "SQL injection is one of the most critical vulnerabilities because it can lead to:"
    story.append(Paragraph(risks_intro, body_style))
    
    risks_data = [
        [Paragraph("&bull; <b>Data Exfiltration:</b> Read confidential data (e.g. passwords, credit card numbers, PII) directly from any table.", body_style)],
        [Paragraph("&bull; <b>Data Loss & Destruction:</b> Execute statements like <font face='Courier'>DROP TABLE</font> or modify balances, permissions, and profiles.", body_style)],
        [Paragraph("&bull; <b>Authentication Bypass:</b> Login into arbitrary accounts without knowing their credentials.", body_style)],
        [Paragraph("&bull; <b>Host Compromise:</b> Write arbitrary files to the server filesystem or execute system shell commands in highly permissive environments.", body_style)]
    ]
    story.append(Table(risks_data, colWidths=[500], style=TableStyle([('PADDING', (0,0), (-1,-1), 3)])))
    story.append(Spacer(1, 15))

    # 6. MITIGATION & PREVENTION
    story.append(Paragraph("6. Mitigation & Prevention Methods", heading_style))
    mitigation_text = (
        "Preventing SQL Injection requires one absolute rule: <b>Never trust user input, and keep query instructions separate from data variables.</b>"
    )
    story.append(Paragraph(mitigation_text, body_style))

    # Prevention card comparison
    comparison_data = [
        [
            Paragraph("<b>INSECURE (String Concatenation)</b>", ParagraphStyle('InsTitle', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#991b1b'))),
            Paragraph("<b>SECURE (Parameterized Query)</b>", ParagraphStyle('SecTitle', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#166534')))
        ],
        [
            Paragraph("<font face='Courier'># Vulnerable Python SQL<br/>"
                      "cursor.execute(<br/>"
                      "  \"SELECT * FROM users WHERE \"<br/>"
                      "  f\"user = '{username}'\"<br/>"
                      ")</font>", code_style),
            Paragraph("<font face='Courier'># Secure Parameterization<br/>"
                      "cursor.execute(<br/>"
                      "  \"SELECT * FROM users WHERE \"<br/>"
                      "  \"user = %s\",<br/>"
                      "  (username,)<br/>"
                      ")</font>", code_style)
        ]
    ]
    comparison_table = Table(comparison_data, colWidths=[247, 247])
    comparison_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#fef2f2')),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor('#f0fdf4')),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(comparison_table)
    story.append(Spacer(1, 10))
    
    prevention_bullets = (
        "<b>Core Defenses:</b><br/>"
        "1. <b>Prepared Statements (Parameterized Queries):</b> Forces the database to compile the query outline first, then inserts parameters. Inputs are guaranteed to remain as literal data, never executable instructions.<br/>"
        "2. <b>Input Validation & Sanitization:</b> Allowlist safe inputs (e.g. ensure numerical fields contain only numbers).<br/>"
        "3. <b>Least Privilege:</b> Ensure database accounts used by applications only have read/write access to necessary tables and have system file operations disabled."
    )
    story.append(Paragraph(prevention_bullets, body_style))
    story.append(Spacer(1, 15))

    # 7. DISCLAIMER BANNER
    disclaimer_data = [
        [Paragraph("<b>EDUCATIONAL DISCLAIMER & NOTICE</b><br/>"
                   "This document and the associated sandbox labs are designed solely for safe, localized cybersecurity education and defensive verification. "
                   "Never test, scan, or execute payloads against systems or applications you do not own or have written, explicit authorization to assess. "
                   "Unauthorized penetration testing is illegal under computer fraud statutes worldwide.", callout_style)]
    ]
    disclaimer_table = Table(disclaimer_data, colWidths=[504])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff1f2')),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor('#fecdd3')),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(disclaimer_table)

    # Build the document
    doc.build(story)
    print("PDF compilation completed successfully at docs/sql-injection-guide.pdf!")

if __name__ == "__main__":
    build_pdf()
