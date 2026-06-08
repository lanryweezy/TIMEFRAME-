import sys

file_path = "components/Timeline.tsx"
with open(file_path, "r") as f:
    content = f.read()

search = """        <div
          className="relative min-h-[500px]"
          ref={timelineRef}
          onClick={handleTimelineClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}"""

replace = """        <div
          className="relative min-h-[500px]"
          ref={timelineRef}
          onClick={handleTimelineClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseMove={(e) => {
            if (timelineRef.current) {
                handleMouseMove(e.nativeEvent, timelineRef as React.RefObject<HTMLDivElement>);
            }
          }}"""

if search in content:
    content = content.replace(search, replace)
    with open(file_path, "w") as f:
        f.write(content)
    print("Replaced handleMouseMove in Timeline.tsx successfully.")
else:
    print("Search string not found in Timeline.tsx.")
