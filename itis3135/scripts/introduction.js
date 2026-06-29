// ===================================================================
// introduction.js
// Powers introduction_form.html: dynamic course rows, validation,
// clear/reset behavior, and rendering the submitted introduction.
// ===================================================================

const DEFAULT_IMAGE_SRC =
  "images/Racoon.jpg";

let courseCount = 1; // one course entry already exists in the static HTML

document.addEventListener("DOMContentLoaded", function () {
  const formElement = document.getElementById("form");
  const coursesContainer = document.getElementById("coursesContainer");
  const addCourseBtn = document.getElementById("addCourseBtn");
  const clearBtn = document.getElementById("clearBtn");
  const pictureUpload = document.getElementById("pictureUpload");
  const resultsSection = document.getElementById("results");

  // -----------------------------------------------------------------
  // Prevents the default page-refresh behavior of the form
  // -----------------------------------------------------------------
  formElement.addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page refresh / default behavior

    if (!validateForm(formElement)) {
      return;
    }

    const data = gatherFormData(formElement);
    renderResults(data);
    showResults();
  });

  // -----------------------------------------------------------------
  // Validates the form and lets the browser show its built-in
  // "please fill out this field" messages if anything is missing.
  // -----------------------------------------------------------------
  function validateForm(form) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    return true;
  }

  // -----------------------------------------------------------------
  // Adds a new, empty course text box with its own delete button
  // -----------------------------------------------------------------
  function addCourseEntry() {
    courseCount++;

    const entry = document.createElement("fieldset");
    entry.className = "course-entry";
    entry.dataset.courseIndex = String(courseCount);

    entry.innerHTML =
      '<legend>Course ' + courseCount + '</legend>' +
      '<button type="button" class="delete-course-btn">Delete</button>' +
      '<label for="courseDept' + courseCount + '">Department</label>' +
      '<input type="text" id="courseDept' + courseCount + '" name="courseDept' + courseCount + '" placeholder="e.g. ITIS">' +
      '<label for="courseNum' + courseCount + '">Number</label>' +
      '<input type="text" id="courseNum' + courseCount + '" name="courseNum' + courseCount + '" placeholder="e.g. 3135">' +
      '<label for="courseName' + courseCount + '">Name</label>' +
      '<input type="text" id="courseName' + courseCount + '" name="courseName' + courseCount + '" placeholder="Course name">' +
      '<label for="courseReason' + courseCount + '">Reason</label>' +
      '<input type="text" id="courseReason' + courseCount + '" name="courseReason' + courseCount + '" placeholder="Why are you taking this course?">';

    coursesContainer.appendChild(entry);

    // Add a delete button beside this new course text box
    entry.querySelector(".delete-course-btn").addEventListener("click", function () {
      entry.remove();
    });
  }

  addCourseBtn.addEventListener("click", addCourseEntry);

  // -----------------------------------------------------------------
  // Clear button: empties every field (text/url/date/textarea/checkbox),
  // clears the chosen file, and removes any extra course entries.
  // -----------------------------------------------------------------
  clearBtn.addEventListener("click", function () {
    Array.from(formElement.querySelectorAll("input[type='text'], input[type='url'], input[type='date'], textarea"))
      .forEach(function (field) {
        field.value = "";
      });

    Array.from(formElement.querySelectorAll("input[type='checkbox']"))
      .forEach(function (checkbox) {
        checkbox.checked = false;
      });

    pictureUpload.value = "";

    removeExtraCourseEntries();
  });

  // -----------------------------------------------------------------
  // Reset button (type="reset"): browser restores every field's
  // original value attribute automatically. We just need to clean up
  // anything the browser doesn't know about -- any course rows that
  // were added dynamically.
  // -----------------------------------------------------------------
  formElement.addEventListener("reset", function () {
    setTimeout(function () {
      removeExtraCourseEntries();
    }, 0);
  });

  function removeExtraCourseEntries() {
    const entries = coursesContainer.querySelectorAll(".course-entry");
    entries.forEach(function (entry, index) {
      if (index > 0) {
        entry.remove();
      }
    });
    courseCount = 1;
  }

  // -----------------------------------------------------------------
  // Gathers all current form data, including any dynamically added
  // course entries, into a plain object.
  // -----------------------------------------------------------------
  function gatherFormData(form) {
    const data = {};

    data.firstName = form.firstName.value;
    data.middleName = form.middleName.value;
    data.nickname = form.nickname.value;
    data.lastName = form.lastName.value;

    data.ackStatement = form.ackStatement.checked;
    data.ackDate = form.ackDate.value;

    data.mascotAdjective = form.mascotAdjective.value;
    data.mascotAnimal = form.mascotAnimal.value;

    data.divider = form.divider.value || "✦";

    data.pictureSrc = (pictureUpload.files && pictureUpload.files[0])
      ? URL.createObjectURL(pictureUpload.files[0])
      : DEFAULT_IMAGE_SRC;
    data.pictureCaption = form.pictureCaption.value;

    data.personalStatement = form.personalStatement.value;

    data.bullets = [
      { label: "Personal Background", value: form.bullet1.value },
      { label: "Professional Background", value: form.bullet2.value },
      { label: "Academic Background", value: form.bullet3.value },
      { label: "Hobbies & Interests", value: form.bullet4.value },
      { label: "Family", value: form.bullet5.value },
      { label: "Career Goals", value: form.bullet6.value },
      { label: "Something Unique About Me", value: form.bullet7.value }
    ];

    data.courses = [];
    coursesContainer.querySelectorAll(".course-entry").forEach(function (entry) {
      const i = entry.dataset.courseIndex;
      const dept = document.getElementById("courseDept" + i);
      const num = document.getElementById("courseNum" + i);
      const name = document.getElementById("courseName" + i);
      const reason = document.getElementById("courseReason" + i);
      if (dept && dept.value) {
        data.courses.push({
          dept: dept.value,
          num: num ? num.value : "",
          name: name ? name.value : "",
          reason: reason ? reason.value : ""
        });
      }
    });

    data.quote = form.quote.value;
    data.quoteAuthor = form.quoteAuthor.value;

    data.funnyThing = form.funnyThing.value;
    data.shareThing = form.shareThing.value;

    data.links = [
      form.link1.value,
      form.link2.value,
      form.link3.value,
      form.link4.value,
      form.link5.value
    ].filter(function (link) { return link.trim() !== ""; });

    return data;
  }

  // -----------------------------------------------------------------
  // Renders the gathered data as an "introduction card" in place of
  // the form, with a Reset link at the bottom.
  // -----------------------------------------------------------------
  function renderResults(data) {
    const fullName =
      data.firstName + " " +
      (data.middleName ? data.middleName + " " : "") +
      data.lastName +
      (data.nickname ? " \"" + data.nickname + "\"" : "");

    const bulletsHtml = data.bullets
      .map(function (b) { return "<li><strong>" + b.label + ":</strong> " + b.value + "</li>"; })
      .join("");

    const coursesHtml = data.courses
      .map(function (c) {
        return "<li><strong>" + c.dept + " " + c.num + " &mdash; " + c.name +
          ":</strong> " + c.reason + "</li>";
      })
      .join("");

    const linksHtml = data.links
      .map(function (link) { return '<li><a href="' + link + '" target="_blank">' + link + "</a></li>"; })
      .join("");

    const divider = '<div class="divider">' + (data.divider + " ").repeat(5).trim() + "</div>";

    let html = "";

    // 1. Agreement at the top
    html += '<p class="agreement"><strong>Acknowledgment:</strong> ' +
      (data.ackStatement ? "Yes" : "No") +
      " &mdash; acknowledged on " + data.ackDate + "</p>";

    // 2. Image below that
    html += '<figure><img src="' + data.pictureSrc + '" alt="' + data.pictureCaption + '">';
    html += "<figcaption>" + data.pictureCaption + "</figcaption></figure>";

    html += divider;

    // 3. Everything else as unordered lists
    html += "<h4>About Me</h4><ul>";
    html += "<li><strong>Name:</strong> " + fullName + "</li>";
    html += "<li><strong>Mascot:</strong> " + data.mascotAdjective + " " + data.mascotAnimal + "</li>";
    html += "<li><strong>Personal Statement:</strong> " + data.personalStatement + "</li>";
    html += bulletsHtml;
    html += "</ul>";

    html += divider;

    html += "<h4>This Semester's Courses</h4><ul>" + coursesHtml + "</ul>";

    html += divider;

    html += "<h4>Quote</h4><ul><li>&ldquo;" + data.quote + "&rdquo; &mdash; " + data.quoteAuthor + "</li></ul>";

    if (data.funnyThing || data.shareThing) {
      html += divider;
      html += "<h4>Extras</h4><ul>";
      if (data.funnyThing) {
        html += "<li><strong>Funny Thing:</strong> " + data.funnyThing + "</li>";
      }
      if (data.shareThing) {
        html += "<li><strong>Something I'd Like to Share:</strong> " + data.shareThing + "</li>";
      }
      html += "</ul>";
    }

    if (data.links.length) {
      html += divider;
      html += "<h4>Find Me Online</h4><ul>" + linksHtml + "</ul>";
    }

    html += '<button type="button" id="resetFromResults">Reset</button>';

    resultsSection.innerHTML = html;

    document.getElementById("resetFromResults").addEventListener("click", function () {
      formElement.reset(); // triggers the form's native 'reset' event/listener above
      showForm();
    });
  }

  function showResults() {
    formElement.hidden = true;
    resultsSection.hidden = false;
  }

  function showForm() {
    resultsSection.hidden = true;
    formElement.hidden = false;
  }
});
