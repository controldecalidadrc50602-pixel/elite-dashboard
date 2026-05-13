
import re
from collections import Counter

content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()

# Remove strings to avoid false positives in regex
content = re.sub(r'//.*', '', content)
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
# content = re.sub(r'"(.*?)"', '""', content)
# content = re.sub(r"'(.*?)'", "''", content)
# content = re.sub(r"`(.*?)`", "``", content, flags=re.DOTALL)

# Find tags
# We need to handle self-closing tags like <div />
# And components like <motion.div>

open_tags = re.findall(r'<([a-zA-Z0-9\.]+)(?![^>]*/>)', content)
close_tags = re.findall(r'</([a-zA-Z0-9\.]+)', content)

print('Open:', Counter(open_tags))
print('Close:', Counter(close_tags))

# Check mismatches
open_counter = Counter(open_tags)
close_counter = Counter(close_tags)

for tag in set(open_counter.keys()) | set(close_counter.keys()):
    if open_counter[tag] != close_counter[tag]:
        print(f"Mismatch in {tag}: Open {open_counter[tag]}, Close {close_counter[tag]}")
