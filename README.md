# Prayer Calendar App

A web application that generates a customizable prayer times calendar that can be subscribed to in various calendar applications like Google Calendar, Microsoft Outlook, and Apple Calendar.

## Features

- Generate prayer times based on location
- Customize which prayer times appear in your calendar
- Set alarm notifications for prayer times
- Adjust the duration of prayer events
- Choose from different calculation methods for prayer times

## Development

### Prerequisites

- Node.js 14.x or higher
- pnpm 

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AhmedElywa/prayCalendar.git
   cd prayCalendar
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

### Testing

The project uses Jest for unit testing. The tests are automatically run before each commit using Husky.

Run the tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

### Commit Workflow

This project uses Husky to run tests before each commit:

1. Tests are automatically run when you commit
2. If tests fail, the commit will be aborted
3. Fix the issues and try committing again

## License

ISC

## Generate Pray Calendar Subscribe link

Please visit [https://pray.ahmedelywa.com](https://pray.ahmedelywa.com) to generate your own Pray Calendar Subscribe link.