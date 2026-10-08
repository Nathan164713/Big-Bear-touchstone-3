"use strict";
const programDetails = {
  "full-day": {name:"Full-Day Care", description:"A full-day option for families seeking a consistent daily care routine."},
  "part-day": {name:"Part-Day Care", description:"A shorter care option for families who need part of the day."},
  "after-school": {name:"After-School Care", description:"A care option for children who need support after the school day."}
};
const requiredFields = ["parent-name", "email", "phone", "child-age", "start-date", "program"];
const storageKey = "bigBearPreferredProgram";
function showProgram(choice) {
  const result = document.getElementById("program-result");
  const detail = programDetails[choice];
  result.textContent = detail ? `${detail.name}: ${detail.description}` : "Please choose a program to preview.";
  if (detail) {
    try { localStorage.setItem(storageKey, choice); } catch (error) { /* Storage may be unavailable. */ }
    document.getElementById("saved-choice").textContent = `Remembered choice: ${detail.name}`;
  }
}
function restoreProgram() {
  let choice = null;
  try { choice = localStorage.getItem(storageKey); } catch (error) { /* Storage may be unavailable. */ }
  if (choice && programDetails[choice]) {
    document.getElementById("care-choice").value = choice;
    document.getElementById("program").value = choice;
    showProgram(choice);
  }
}
function validateField(id) {
  const input = document.getElementById(id);
  const value = input.value.trim();
  let message = "";
  if (!value) message = "This field is required.";
  else if (id === "parent-name" && value.length < 2) message = "Enter at least 2 characters.";
  else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Enter a valid email address.";
  else if (id === "phone" && !/^\d{3}-\d{3}-\d{4}$/.test(value)) message = "Use the format 555-555-5555.";
  else if (id === "child-age" && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 12)) message = "Enter an age from 1 to 12.";
  else if (id === "start-date" && value < new Date().toLocaleDateString("en-CA")) message = "Choose today or a future date.";
  document.getElementById(`${id}-error`).textContent = message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}
function validateForm(event) {
  event.preventDefault();
  const valid = requiredFields.map(validateField).every(Boolean);
  document.getElementById("form-status").textContent = valid
    ? "Your entries look valid. This is a demonstration form; no request has been sent."
    : "Please correct the highlighted fields before continuing.";
}
document.addEventListener("DOMContentLoaded", () => {
  restoreProgram();
  document.getElementById("show-program").addEventListener("click", () => showProgram(document.getElementById("care-choice").value));
  document.getElementById("care-choice").addEventListener("change", event => {
    if (programDetails[event.target.value]) document.getElementById("program").value = event.target.value;
  });
  document.getElementById("enrollment-form").addEventListener("submit", validateForm);
  requiredFields.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true") validateField(id); });
    input.addEventListener("change", () => { if (input.getAttribute("aria-invalid") === "true") validateField(id); });
  });
});
