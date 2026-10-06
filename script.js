// ---- Settings: change these two values before launch ----
var CONTACT_EMAIL = "edznailzid@gmail.com";
// Paste your Formspree form address here (it looks like https://formspree.io/f/xxxxxxxx)
// so enquiries are sent straight to your inbox. Leave empty to open the visitor's email app instead.
var FORM_ENDPOINT = "";
// -----------------------------------------------------------

(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("status");
  var fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message")
  };

  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + CONTACT_EMAIL;
    a.textContent = CONTACT_EMAIL;
  });

  function show(text, isError) {
    status.textContent = text;
    status.className = isError ? "error" : "";
  }

  function validate() {
    var problem = "", first = null;
    Object.keys(fields).forEach(function (k) { fields[k].removeAttribute("aria-invalid"); });
    function fail(field, text) {
      field.setAttribute("aria-invalid", "true");
      if (!first) { first = field; problem = text; }
    }
    if (!fields.name.value.trim()) fail(fields.name, "Enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.value.trim()))
      fail(fields.email, "Enter a valid email address, like name@company.com.");
    if (!fields.message.value.trim()) fail(fields.message, "Enter a message so we know how to help.");
    if (first) { show(problem, true); first.focus(); return false; }
    return true;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validate()) return;
    var data = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim()
    };

    if (FORM_ENDPOINT) {
      var btn = form.querySelector("button");
      btn.disabled = true; // stops a double click from sending the enquiry twice
      show("Sending your message…", false);
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("bad response");
        form.reset();
        show("Thank you. We received your message and will reply by email.", false);
      }).catch(function () {
        show("Your message was not sent. Check your connection and try again, or email " + CONTACT_EMAIL + ".", true);
      }).then(function () {
        btn.disabled = false;
      });
    } else {
      show("Opening your email app. Send the message there to finish.", false);
      location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Enquiry from " + data.name) +
        "&body=" + encodeURIComponent(data.message + "\n\nReply to: " + data.email);
    }
  });
})();
