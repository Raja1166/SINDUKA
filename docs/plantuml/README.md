# PlantUML untuk Aplikasi SINDUKA Guardian

Folder ini berisi source PlantUML yang dapat langsung dipakai untuk membuat diagram laporan.

## Daftar file

1. 01_usecase_diagram.puml
2. 02_class_diagram.puml
3. 03_activity_diagram.puml
4. 04_sequence_diagram.puml
5. 05_state_machine_diagram.puml
6. 06_component_diagram.puml
7. 07_deployment_diagram.puml
8. 08_er_diagram.puml
9. 09_requirements_matrix.md
10. 10_all_in_one_diagram.puml

## Cara pakai

1. Buka VS Code.
2. Install ekstensi PlantUML.
3. Buka file .puml.
4. Gunakan perintah preview diagram atau export PNG/SVG.

## Contoh perintah CLI

```bash
java -jar plantuml.jar -tsvg 01_usecase_diagram.puml
java -jar plantuml.jar -tpng 02_class_diagram.puml
```

Jika Anda ingin, saya juga bisa lanjutkan dengan versi yang lebih formal untuk laporan tugas akhir, misalnya:
- diagram use case dengan aktor dan skenario lengkap,
- deskripsi setiap diagram per bab,
- versi siap copy-paste ke dokumen laporan.
