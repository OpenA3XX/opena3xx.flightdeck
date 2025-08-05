# 🛫 OpenA3XX Flightdeck

Welcome to the **Flightdeck** repository of [OpenA3XX](https://github.com/OpenA3XX) — an open-source Airbus home cockpit simulation platform.

This repository provides the **web-based cockpit interface** that simulates the Airbus flight deck and integrates with hardware, simulator state, and control logic for an immersive home cockpit experience.

---

## 📌 About This Repository

- **Name**: `opena3xx.flightdeck`
- **Language Stack**:  
  - TypeScript (~47%)  
  - SCSS (~30%)  
  - HTML (~22%)  
  - Others: Shell, Dockerfile, JS  
- **License**: [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)  
- **Status**: Maintained (last update: July 27, 2025)  
- **Intended Use**: Personal, non-commercial simulator cockpit integration

---

## 💡 Purpose

This repository is the **frontend and supervisor UI** for the OpenA3XX ecosystem. It brings together:

- **Panel interfaces**: Overhead, FCU, pedestal, MCDU, etc.
- **Live state rendering**: Interacts with MSFS (via coordinator service)
- **Hardware integration**: Receives inputs from the OpenA3XX Raspberry Pi-based controller
- **Modular layout**: Easily extendable with new panels and avionics

---

## 🧩 Ecosystem Integration

`opena3xx.flightdeck` is one component of the broader **OpenA3XX** platform:

| Repository | Purpose |
|------------|---------|
| [`opena3xx.documentation`](https://github.com/OpenA3XX/opena3xx.documentation) | Official GitBook documentation and build guides |
| [`opena3xx.coordinator`](https://github.com/OpenA3XX/opena3xx.coordinator) | .NET service that coordinates simulator state, hardware, and frontend |
| [`opena3xx.hardware.controller`](https://github.com/OpenA3XX/opena3xx.hardware.controller) | Python-based hardware handler for Raspberry Pi (MobiFlight-compatible) |
| `opena3xx.panel-design` *(WIP)* | 3D models, schematics, and fabrication files for panels |

---

## 🚀 Features

- Modular UI architecture (panels can be individually managed)
- Responsive design for touchscreens and custom displays
- Connects to MSFS via coordinator and SimConnect (indirect)
- Docker-ready for deployment on dedicated touchscreen panels or tablets
- Open to community extensions and pull requests

---

## 🛠️ Getting Started

> Detailed instructions will be provided in the main documentation site:  
> [OpenA3XX Documentation](https://github.com/OpenA3XX/opena3xx.documentation)

Basic build instructions:
```bash
git clone https://github.com/OpenA3XX/opena3xx.flightdeck.git
cd opena3xx.flightdeck
# Install dependencies
npm install
# Run development server
npm run dev
