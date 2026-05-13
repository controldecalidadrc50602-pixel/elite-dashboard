
import re

content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()

# Remove comments and strings
content = re.sub(r'//.*', '', content)
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

stack = []
lines = content.split('\n')

for i, line in enumerate(lines):
    # Find all tags in this line
    # Using a simple regex that finds <tag or </tag
    tags = re.findall(r'<(/?)([a-zA-Z0-9\.]+)([^>]*?)(/?)>', line)
    for is_close, tag_name, attrs, is_self_close in tags:
        if is_self_close:
            continue
        if tag_name not in ['div', 'motion.div', 'header', 'form', 'AnimatePresence']:
            continue
            
        if is_close:
            if not stack:
                print(f"Error: Unexpected closing tag </{tag_name}> at line {i+1}")
            else:
                last_tag = stack.pop()
                if last_tag != tag_name:
                    print(f"Error: Mismatched tag. Expected </{last_tag}>, found </{tag_name}> at line {i+1}")
        else:
            stack.append(tag_name)

if stack:
    print(f"Error: Unclosed tags: {stack}")
