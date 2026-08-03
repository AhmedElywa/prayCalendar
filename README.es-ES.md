

<div align="center">

# PrayCalendar

**Sincroniza horarios de oración precisos con calendarios de Google, Apple u Outlook**

[![Live Demo](https://img.shields.io/badge/demo-pray.ahmedelywa.com-gold?style=for-the-badge)](https://pray.ahmedelywa.com)
[![License](https://img.shields.io/badge/license-ISC-blue?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

Suscríbete una vez. Obtén horarios de oración precisos sincronizados en tu calendario — actualizados automáticamente.

[Demo en vivo](https://pray.ahmedelywa.com) · [Reportar error](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=bug&template=bug_report.md) · [Solicitar funcionalidad](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=enhancement&template=feature_request.md)

</div>

---

## Funcionalidades

### Integración con calendarios
- **Suscripción con un clic** a Google Calendar, Apple Calendar u Outlook
- **Código QR** para suscripción móvil sencilla
- **Exportación a PDF** para horarios imprimibles
- **Configuraciones compartibles** para mezquitas y comunidades

### Personalización de oraciones
- **Más de 14 métodos de cálculo** — Egipcio, ISNA, MWL, Umm Al-Qura, Diyanet y más
- **Alarmas personalizables** — en el momento de la oración o 5/10/15/20/30 minutos antes
- **Seleccionar oraciones específicas** — Fajr, Amanecer, Dhuhr, Asr, Maghrib, Isha, Medianoche
- **Filtrado por días de la semana** — generar eventos solo para días específicos
- **Duración de evento personalizada** — de 5 a 60 minutos

### Modos especiales
- **Modo Ramadán** — eventos automáticos de Iftar, Tarawih y Suhoor
- **Modo de viaje (Qasr)** — oraciones acortadas para viajeros
- **Modo Jumu'ah** — oración del viernes que reemplaza a Dhuhr
- **Estado ocupado** — bloquear disponibilidad del calendario durante las oraciones

### Complementos
- **Dirección de la Qibla** — orientación en grados en las descripciones de los eventos
- **Dú'a y Adhkar** — plegarias auténticas de Hisn al-Muslim
- **Desplazamientos de Iqama** — eventos de Iqama separados para cada oración
- **Fecha Hijri** — visualización de la fecha del calendario islámico

### Soporte multilingüe
Inglés, Árabe (RTL), Turco, Francés, Urdu e Indonesio

### Más de 45 ciudades preconfiguradas
Páginas de acceso rápido para las principales ciudades del mundo con métodos de cálculo optimizados:
- Meca, Medina, El Cairo, Estambul, Dubái, Londres, Nueva York y muchas más

### Funcionalidades para desarrolladores
- **API JSON** — endpoint RESTful para datos de horarios de oración
- **Widget integrable** — widget iframe/JS con herramienta generadora
- **Home Assistant** — guía de integración para hogares inteligentes

---

## Inicio rápido

### Uso en línea
Visita **[pray.ahmedelywa.com](https://pray.ahmedelywa.com)** para generar tu enlace de suscripción al calendario.

### Autoalojamiento

#### Requisitos previos
- [Bun](https://bun.sh) (recomendado) o Node.js 18+
- Redis (opcional, para almacenamiento en caché)

#### Instalación

```bash
# Clone the repository
git clone https://github.com/AhmedElywa/prayCalendar.git
cd prayCalendar

# Install dependencies
bun install

# Start development server
bun dev
```

La aplicación estará disponible en `http://localhost:3300`

#### Variables de entorno

```bash
# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Admin dashboard access
ADMIN_KEY=your-secret-key
```

---

## Referencia de la API

### Feed del calendario ICS
```
GET /api/prayer-times.ics
```

| Parámetro | Tipo | Predeterminado | Descripción |
|-----------|------|---------|-------------|
| `address` | string | — | Ciudad o dirección (por ejemplo, "El Cairo, Egipto") |
| `latitude` | number | — | Latitud (alternativa a la dirección) |
| `longitude` | number | — | Longitud (alternativa a la dirección) |
| `method` | number | 5 | [Método de cálculo](https://pray.ahmedelywa.com/api-docs) |
| `duration` | number | 25 | Duración del evento en minutos |
| `months` | number | 3 | Longitud del calendario (1-11) |
| `alarm` | string | 5 | Desplazamientos de alarma, separados por comas |
| `events` | string | all | Índices de oración (0=Fajr...6=Medianoche) |
| `lang` | string | en | Idioma (en/ar/tr/fr/ur/id) |
| `traveler` | boolean | false | Habilitar modo Qasr |
| `jumuah` | boolean | false | Habilitar oración del viernes |
| `ramadanMode` | boolean | false | Habilitar eventos de Ramadán |
| `qibla` | boolean | false | Incluir dirección de la Qibla |
| `dua` | boolean | false | Incluir Dú'a/Adhkar |
| `busy` | boolean | false | Marcar como estado ocupado |

**Ejemplo:**
```
https://pray.ahmedelywa.com/api/prayer-times.ics?address=Cairo,Egypt&method=5&alarm=5,10
```

### API JSON
```
GET /api/prayer-times.json
```
Devuelve los horarios de hoy, cuenta regresiva para la próxima oración y fecha Hijri.

### Documentación completa
Consulta la [Documentación de la API](https://pray.ahmedelywa.com/api-docs) para una referencia completa de los parámetros.

---

## Stack tecnológico

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Lenguaje:** [TypeScript 5.9](https://typescriptlang.org)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com)
- **Entorno de ejecución:** [Bun](https://bun.sh)
- **Caché:** [Redis](https://redis.io)
- **Calendario:** [ical-generator](https://github.com/sebbo2002/ical-generator)
- **Pruebas:** [Playwright](https://playwright.dev) (E2E), Bun test (unitarios)
- **Análisis de código:** [Biome](https://biomejs.dev)

---

## Scripts

```bash
bun dev          # Start development server
bun build        # Production build
bun start        # Start production server
bun test         # Run unit tests
bun test:watch   # Run tests in watch mode
bun lint         # Run linter
bun format       # Format code
bun check:fix    # Fix linting issues
```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, lee nuestra [Guía de Contribución](CONTRIBUTING.md) para obtener detalles sobre:

- Cómo enviar informes de errores y solicitudes de funcionalidades
- Flujo de trabajo de desarrollo y estilo de código
- Proceso de pull requests

---

## Licencia

Este proyecto está licenciado bajo la Licencia ISC - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Agradecimientos

- Los horarios de oración se calculan utilizando la [API AlAdhan](https://aladhan.com/prayer-times-api)
- Dú'a y Adhkar obtenidos de Hisn al-Muslim

---

<div align="center">

**[pray.ahmedelywa.com](https://pray.ahmedelywa.com)**

Hecho con cuidado por [Ahmed Elywa](https://ahmedelywa.com)

</div>
