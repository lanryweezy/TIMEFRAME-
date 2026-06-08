import sys

file_path = "components/Timeline.tsx"
with open(file_path, "r") as f:
    content = f.read()

search = """    ],
    [state.currentTime, state.duration],
  );

  const pulseIndicator = React.useMemo("""
replace = """    ],
    [state.duration],
  );

  const pulseIndicator = React.useMemo("""

if search in content:
    content = content.replace(search, replace)
    with open(file_path, "w") as f:
        f.write(content)
    print("Fixed useMemo dependency in Timeline")
else:
    print("Search not found")
