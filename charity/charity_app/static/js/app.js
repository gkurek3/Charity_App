document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep++;
                    this.updateForm();
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            if (this.currentStep === 1) {
                const inst_choice = Array.from(document.getElementsByName('categories'));
                const button = document.querySelector('button');
                const checked = [];
                inst_choice.forEach(function (el) {
                    el.addEventListener('click', function () {
                        button.disabled = false;
                    });
                });
            }

            if (this.currentStep === 2) {
                const bags = document.getElementsByName('bags');
                const button = document.querySelectorAll('.btn.next-step')[1];

                bags.forEach(function (el) {
                    el.addEventListener('keyup', function () {
                        button.disabled = false;
                    });
                    el.addEventListener('click', function () {
                        button.disabled = false;
                    })
                });

            }

            if (this.currentStep === 3) {
                const inst_choice = Array.from(document.getElementsByName('categories'));
                const organizations = Array.from(document.getElementsByName('div_organization'));
                const button = document.querySelectorAll('.btn.next-step')[2];


                inst_choice.forEach(function (el) {
                    if (el.checked === true) {
                        organizations.forEach(function (element) {
                            element.addEventListener('click', function () {
                                button.disabled = false;
                            });
                            if (element.dataset.categories.includes(el.id)) {
                                element.style.display = 'block';
                            }
                        });
                    }
                })
            }

            if (this.currentStep === 5) {
                const bag_number = document.getElementsByName("bags")[0].value;
                const bag_info = document.querySelector("#no_of_bags");
                const inst_choice = Array.from(document.getElementsByName('categories'));
                const for_who = document.querySelector('#for_who');
                const organizations = Array.from(document.getElementsByName('organization'));
                const address = document.getElementsByName('address');
                const city = document.getElementsByName('city');
                const postcode = document.getElementsByName('postcode');
                const phone = document.getElementsByName('phone');
                const data = document.getElementsByName('data');
                const time = document.getElementsByName('time');
                const more_info = document.getElementsByName('more_info');
                const button = document.querySelectorAll('button')[8];
                const error_text = document.querySelector('#errorText');
                const h3 = document.querySelectorAll('h3')[0];

                const cat_checked = [];
                inst_choice.forEach(function (el) {
                    if (el.checked === true) {
                        cat_checked.push(el.value);
                    }
                });

                const inst_checked = [];
                organizations.forEach(function (el) {
                    if (el.checked === true) {
                        inst_checked.push(el.value);
                    }
                });

                bag_info.innerHTML = `${bag_number} worków ${cat_checked}`;
                for_who.innerHTML = `dla ${inst_checked}`;
                document.querySelector("#address").innerHTML = address[0].value;
                document.querySelector("#city").innerHTML = city[0].value;
                document.querySelector("#postcode").innerHTML = postcode[0].value;
                document.querySelector("#phone").innerHTML = phone[0].value;
                document.querySelector('#data').innerHTML = data[0].value;
                document.querySelector('#time').innerHTML = time[0].value;
                document.querySelector('#more_info').innerHTML = more_info[0].value;

                if (bag_number.length === 0) {
                    h3.innerHTML = "BŁĄÐ!"
                    error_text.innerHTML = "Nie podałeś/podałaś ilości worków!"
                } else if (address[0].value.length === 0 || city[0].value.length === 0 || postcode[0].value.length === 0 || phone[0].value.length === 0 || data[0].value.length === 0 || time[0].value.length === 0) {
                    h3.innerHTML = "BŁĄÐ!"
                    error_text.innerHTML = "Wypełnił poprawnie formularz odbioru paczki!"
                } else {
                    button.disabled = false;
                }
            }

            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            // TODO: get data from inputs and show them in summary
        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */
        submit(e) {
            // e.preventDefault();
            this.currentStep++;
            this.updateForm();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }
});
