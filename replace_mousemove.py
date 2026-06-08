import sys

file_path = "components/Timeline.tsx"
with open(file_path, "r") as f:
    content = f.read()

search = """  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (timelineRef.current) {
        handleMouseMove(e, timelineRef as React.RefObject<HTMLDivElement>);
      }
    };
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);"""

replace = """  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);"""

if search in content:
    content = content.replace(search, replace)
    with open(file_path, "w") as f:
        f.write(content)
    print("Replaced handleMouseMoveGlobal event listener successfully.")
else:
    print("Search string not found in Timeline.tsx.")
