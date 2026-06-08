import sys
import re

file_path = "components/Timeline.tsx"
with open(file_path, "r") as f:
    content = f.read()

search = """              <Waveform
                id={item.id}
                url={item.url}
                transients={item.transients}
                duration={item.duration}
                progress={((state.currentTime - item.startTime) / item.duration) * 100}
                color="#06b6d4"
              />"""
replace = """              <Waveform
                id={item.id}
                url={item.url}
                transients={item.transients}
                duration={item.duration}
                startTime={item.startTime}
                color="#06b6d4"
              />"""
if search in content:
    content = content.replace(search, replace)
    with open(file_path, "w") as f:
        f.write(content)
    print("Fixed progress passing to Waveform")
else:
    print("Search not found")
