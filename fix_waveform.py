import sys

file_path = "components/ui/Waveform.tsx"
with open(file_path, "r") as f:
    content = f.read()

search = "export const Waveform: React.FC<WaveformProps> = ({ id, url, data, transients, duration, progress, color, startTime }) => {"
replace = "export const Waveform: React.FC<WaveformProps> = ({ id, url, data, transients, duration, progress, color, startTime }) => {"

if search in content:
    print("Found wave form")
else:
    print("Not found")
