
import re

content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()

# Remove strings and comments to avoid false positives
content = re.sub(r'//.*', '', content)
content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
content = re.sub(r'"(.*?)"', '""', content)
content = re.sub(r"'(.*?)'", "''", content)
content = re.sub(r"`(.*?)`", "``", content, flags=re.DOTALL)

# Ignore operators
content = content.replace('=>', '  ')
content = content.replace('>=', '  ')
content = content.replace('<=', '  ')

counts = {
    '<': 0, '>': 0
}
for char in content:
    if char in counts:
        counts[char] += 1

print(counts)
