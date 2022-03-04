function Validator(options) {
    //Lấy element của form-fiel cần validate
    var formElement = document.querySelector(options.form);

    //Focus và input đầu tiên
    var firstInput = formElement.querySelector('input');
    firstInput.focus();

    //Biến chứa tất cả các rule
    var selectorRules = {};

    //Hàm validate dữ liêu
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        //Lấy ra các rule từ selectorRules
        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMessage;
    }


    if (formElement) {
        //Tạm hoãn submit để validate toàn bị form
        //Lắng nghe sự kiện submit
        formElement.onsubmit = function(e) {
            e.preventDefault();

            //Kiểm tra xem form hợp lệ không
            var isFormValid = true;

            //Lặp qua từng rule và validate
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                //console.log(isValid);
                if (!isValid) {
                    isFormValid = false;
                    //  console.log('Form is valid', isFormValid);
                }
            })

            //Nếu hợp lệ retrun dữ liệu từ người dùng nhập vào
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var validInputs = formElement.querySelectorAll('[name]');
                    var inputValues = Array.from(validInputs).reduce(function(acc, curr) {
                        acc[curr.name] = curr.value;
                        return acc;
                    }, {});
                    console.log('Input Values : ', validInputs);
                    options.onSubmit(inputValues);
                }
            } else {
                console.log('Có lỗi');
            }
        };



        options.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            if (inputElement) {
                //Xử lý khi người dùng blur ra khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                //Xử lý khi người dùng nhập vào input
                inputElement.oninput = function() {
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });

    }
}

//Nguyên tắc rules :
//1. Khi có lỗi trả ra message lỗi
//2. Khi hợp lệ không trả ra gì
Validator.isRequired = function(selector, mess) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : `Vui lòng nhập ${mess}.`;
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value) ? undefined : 'Sai định dạng Email';
        }
    }
}

Validator.isPassword = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Tối thiểu ${min} ký tự`;
        }
    }
}

Validator.isConfirm = function(selector, pw) {
    return {
        selector: selector,
        test: function(value) {
            return value === pw() ? undefined : `Mật khẩu chưa trùng khớp`;
        }
    }
}