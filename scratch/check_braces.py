
content = open('src/components/Modals/ProjectModal.tsx', 'r', encoding='utf-8').read()
counts = {
    '(': 0, ')': 0,
    '[': 0, ']': 0,
    '{': 0, '}': 0,
    '<': 0, '>': 0
}
for char in content:
    if char in counts:
        counts[char] += 1

print(counts)
