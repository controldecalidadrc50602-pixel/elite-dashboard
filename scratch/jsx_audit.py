
import re

def audit_jsx(content):
    # Remove strings and comments
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Be careful with strings as they might contain < or >
    content = re.sub(r'("(?:\\.|[^"\\])*")|(\'(?:\\.|[^\'\\])*\')|(`(?:\\.|[^`\\])*`)', '', content, flags=re.DOTALL)

    # Find tags
    tags = re.findall(r'<(/?)([a-zA-Z0-9\.]+)([^>]*?)(/?)>', content, flags=re.DOTALL)
    
    stack = []
    mismatches = []
    
    # We only care about these tags
    target_tags = {'div', 'motion.div', 'label', 'span', 'p', 'h2', 'h3', 'header', 'footer', 'form', 'button', 'select', 'option', 'input', 'textarea', 'AnimatePresence'}

    for is_closing, tag_name, attrs, is_self_closing in tags:
        if tag_name not in target_tags:
            continue
        
        if is_self_closing == '/' or (tag_name == 'input' and not is_closing):
            # input is often self-closing even without /> in some contexts, 
            # but in JSX it MUST be self-closing or have a closing tag.
            # Here we assume if it has /> or is an input without / it might be self-closing.
            # Actually in JSX <input> is invalid, it must be <input />.
            if is_self_closing == '/':
                continue
            if tag_name == 'input' and is_self_closing != '/':
                 # In JSX this is technically an error if not self-closing
                 pass

        if is_closing == '/':
            if not stack:
                mismatches.append(f"Unexpected closing tag </{tag_name}>")
            else:
                last_tag = stack.pop()
                if last_tag != tag_name:
                    mismatches.append(f"Mismatched closing tag </{tag_name}>, expected </{last_tag}>")
        else:
            if is_self_closing != '/':
                stack.append(tag_name)

    for tag in stack:
        mismatches.append(f"Unclosed tag <{tag}>")

    return mismatches

content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()
mismatches = audit_jsx(content)
for m in mismatches:
    print(m)
