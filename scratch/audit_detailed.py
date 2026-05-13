
import re

content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()

# Remove comments
content = re.sub(r'//.*', '', content)
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)

# Find all potential tags
# We want to find <tag and </tag
# And detect self-closing <tag ... />

tags = []
# This regex finds tags and keeps track of their position
for match in re.finditer(r'<(/?[a-zA-Z0-9\.]+)([^>]*?)(/?)>', content):
    tag_full = match.group(0)
    tag_name = match.group(1)
    is_close = tag_name.startswith('/')
    if is_close:
        tag_name = tag_name[1:]
    is_self_close = match.group(3) == '/'
    
    # Filter only relevant tags to avoid noise from types like <Project>
    if tag_name.lower() in ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'header', 'button', 'form', 'select', 'option', 'label', 'motion.div', 'animatepresence']:
        tags.append({
            'name': tag_name.lower(),
            'is_close': is_close,
            'is_self_close': is_self_close,
            'pos': match.start(),
            'line': content.count('\n', 0, match.start()) + 1
        })

stack = []
for tag in tags:
    if tag['is_self_close']:
        continue
    if tag['is_close']:
        if not stack:
            print(f"Error: Unexpected closing tag </{tag['name']}> at line {tag['line']}")
        else:
            last = stack.pop()
            if last['name'] != tag['name']:
                print(f"Error: Mismatched tag. Expected </{last['name']}> (from line {last['line']}), found </{tag['name']}> at line {tag['line']}")
    else:
        stack.append(tag)

if stack:
    print("Error: Unclosed tags:")
    for tag in stack:
        print(f"  <{tag['name']}> at line {tag['line']}")
