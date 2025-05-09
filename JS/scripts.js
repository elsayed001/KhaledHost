// Vulnerability Simulation Dashboard - DataTables Initialization

// Sidebar Toggle for Vulnerability Simulation Dashboard
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('vs-sidenav-toggled');
            localStorage.setItem('vs|sidebar-toggle', document.body.classList.contains('vs-sidenav-toggled'));
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    // Toggle hints for a specific challenge
    function toggleHints(hintsId) {
      const hints = document.getElementById(hintsId);
      if (hints.style.display === "none" || hints.style.display === "") {
        hints.style.display = "block";
      } else {
        hints.style.display = "none";
      }
    }
     
  
    // Show answer (admin-only functionality)
    function showAnswer(answerId) {
      const isAdmin = sessionStorage.getItem("isAdmin");
      if (isAdmin === "true") {
        const answer = document.getElementById(answerId);
        answer.style.display = "block";
      } else {
        alert("You must be an admin to view the answer!");
      }
    }
  
    // Attach event listeners to hint buttons
    for (let i = 1; i <= 6; i++) {
      const hintButton = document.getElementById(`hintButton${i}`);
      if (hintButton) {
        hintButton.addEventListener("click", function () {
          toggleHints(`hints${i}`);
        });
      }
    }
  
    // Simulate admin login (for testing purposes)
    if (!sessionStorage.getItem("isAdmin")) {
      sessionStorage.setItem("isAdmin", "false");
    }
  
    // Define correct answers
    const correctAnswers = {
      q1: "a", // Cross-Site Scripting
      q2: "a", // <script>alert('XSS')</script>
      q3: "b", // Database
      // Add the rest of the questions here
    };
  
    // Handle quiz submission
    const quizForm = document.getElementById("quizForm");
    if (quizForm) {
      quizForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        let score = 0;
        let totalQuestions = Object.keys(correctAnswers).length;
  
        // Check each question
        for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
          const userAnswer = document.querySelector(`input[name="${question}"]:checked`);
          if (userAnswer && userAnswer.value === correctAnswer) {
            score++;
          }
        }
  
        // Display the score
        const quizResult = document.getElementById("quizResult");
        if (quizResult) {
          quizResult.style.display = "block";
          quizResult.textContent = `You scored ${score} out of ${totalQuestions}`;
        }
      });
    }
  
   
    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
  
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
  
        if (!email || !password) {
          alert("Both email and password are required.");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
            }),
          });
  
          if (response.ok) {
            const result = await response.json();
            alert(`Welcome, ${result.firstName || "User"}!`);
            sessionStorage.setItem("token", result.token);
            window.location.href = "guidelines.html"; // Redirect to another page after login
          } else {
            const error = await response.json();
            alert(`Login failed: ${error.message || "Invalid credentials"}`);
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred while logging in. Please try again later.");
        }
      });
    }
  });
  