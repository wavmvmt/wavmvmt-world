# 3D Model Directory

Drop GLB/GLTF files here. They'll be loaded automatically by the model loader.

## Folders

### `/architecture/`
Architectural models — floor plans, room layouts, full building designs.
- Export from: SketchUp, Revit, Rhino, Blender, ArchiCAD
- Format: .glb (preferred) or .gltf + textures
- Naming: `room-name.glb` (e.g., `parkour-gym.glb`, `full-building.glb`)
- Scale: 1 unit = 1 meter

### `/characters/`
Character models — workers, coaches, NPCs, player avatar.
- Sources: Mixamo, ReadyPlayerMe, Meshy.ai, Sketchfab
- Format: .glb with embedded animations
- Naming: `character-name.glb` (e.g., `construction-worker-01.glb`)

### `/equipment/`
Gym equipment, studio gear, furniture.
- Sources: Sketchfab, TurboSquid, custom Blender
- Format: .glb
- Naming: `item-name.glb` (e.g., `squat-rack.glb`, `mixing-desk.glb`)

### `/vehicles/`
Rideable vehicles — skateboard, forklift, golf cart.
- Format: .glb
- Naming: `vehicle-name.glb`

## Export Tips
- SketchUp: File → Export → 3D Model → .glb
- Revit: Use Revit-to-glTF exporter plugin
- Rhino: File → Export → .glb
- Blender: File → Export → glTF 2.0 (.glb)
- Always check "Apply Modifiers" and "Y-Up" orientation
- Optimize: keep under 10MB per model for web performance
- Draco compression recommended for large models
