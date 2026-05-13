
import re

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    mismatches = []

    # Regex to find tags
    # Group 1: tag name
    # Group 2: self-closing slash
    tag_regex = re.compile(r'<(/?)([a-zA-Z0-9\.]+)([^>]*?)(/?)>')

    for i, line in enumerate(lines):
        line_num = i + 1
        # Find all tags in line
        for match in tag_regex.finditer(line):
            is_closing = match.group(1) == '/'
            tag_name = match.group(2)
            is_self_closing = match.group(4) == '/'
            
            # Skip common non-JSX tags if any, but here we care about div, motion.div, etc.
            if tag_name in ['div', 'motion.div', 'label', 'span', 'p', 'h2', 'h3', 'header', 'footer', 'form', 'button', 'select', 'option', 'input', 'textarea', 'AnimatePresence']:
                if is_self_closing:
                    continue
                if is_closing:
                    if not stack:
                        mismatches.append(f"Unexpected closing tag </{tag_name}> at line {line_num}")
                    else:
                        last_tag, last_line = stack.pop()
                        if last_tag != tag_name:
                            mismatches.append(f"Mismatched closing tag </{tag_name}> at line {line_num}, expected </{last_tag}> (opened at line {last_line})")
                else:
                    stack.append((tag_name, line_num))

    for tag, line in stack:
        mismatches.append(f"Unclosed tag <{tag}> opened at line {line}")

    return mismatches

mismatches = audit_file('src/components/Modals/ProjectModal.tsx')
for m in mismatches:
    print(m)
