# EdWord

EdWord is a **Wordle-inspired daily word puzzle** built as a full-stack web application. Every day, players receive the same five-letter word to solve in six attempts. The backend generates the daily puzzle based on the current date, evaluates guesses, and ensures consistent gameplay, while the frontend provides a responsive and persistent user experience.

---

## Features

* Daily five-letter word puzzle
* Six attempts to guess the word
* Color-coded feedback for each guess
* On-screen keyboard with letter status updates
* Automatic game state persistence using LocalStorage
* Resume unfinished games after refreshing or reopening the browser
* View completed games for the day
* Responsive design for desktop and mobile devices
* Dark mode
* Share results functionality
* Daily puzzle numbering

---

## Tech Stack

### Frontend

* Angular 21 (Standalone Components)
* TypeScript
* Angular Router
* HttpClient
* CSS

### Backend

* ASP.NET Core 8 Web API
* C#

### Deployment

* Netlify (Frontend)
* Render (Backend)
* GitHub

---

## 📁 Project Structure

```text
EdWord/
├── Backend/     # ASP.NET Core Web API
└── Frontend/    # Angular application
```

---

## ⚙️ How It Works

1. The backend selects the daily answer based on the current date.
2. The frontend submits each guess to the backend.
3. The backend validates the guess and evaluates each letter.
4. The frontend updates the board and keyboard using the response.
5. The game state is saved in LocalStorage, allowing players to resume an unfinished game or revisit a completed one.

---

## 📄 License

This project is intended for educational and portfolio purposes.
