function Validator(options) 
{
    var storageDatas = {};

    var objectStorage = {};

    var formElement = document.querySelector(options.form);

    formElement.onsubmit = function (e) 
    {
        var isEnrror = true;
        e.preventDefault();
        options.Rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = Validate(inputElement, rule);
            isEnrror = isValid;
        });
        if (isEnrror)
        {
            if (typeof options.onSubmit === 'function') 
            {
                var nodeList = formElement.querySelectorAll('[name]');
                var formValues = Array.from(nodeList).reduce(function (value, inputElement) {
                return (value[inputElement.name] = inputElement.value) && value;
            }, {});
            options.onSubmit(formValues);
            }
        }
    }
    
    function Validate (inputElement, rule) 
    {
        var notifyError = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
        var rules = objectStorage[rule.selector];

        for (var index = 0; index < rules.length; index++) 
        {
            errorMessage = rules[index](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) 
        {
            inputElement.parentElement.classList.add('notify-input');
            notifyError.innerText = errorMessage;
        } 
        else 
        {
            inputElement.parentElement.classList.remove('notify-input');
            notifyError.innerText = '';
        }
        return !errorMessage;
    }

    if (formElement) 
    {
        options.Rules.forEach(function (rule) {

            var inputElement = formElement.querySelector(rule.selector);
                if (Array.isArray(objectStorage[rule.selector]))
                {
                    objectStorage[rule.selector].push(rule.test);
                }
                else
                {
                    objectStorage[rule.selector] = [rule.test];
                }
            if(inputElement) 
            {
                inputElement.onblur = function () 
                {
                    Validate(inputElement, rule)
                }
                inputElement.oninput = function () 
                {
                    var notifyError = inputElement.parentElement.querySelector(options.errorSelector);
                    inputElement.parentElement.classList.remove('notify-input');
                    notifyError.innerText = '';
                }
            }
        });
    }
}

Validator.isRequire = function(selector, errorMessage) 
{
    return {
        selector: selector,
        test: function (value) 
        {
            return value.trim() ? undefined : errorMessage || 'Vui lòng nhập trường này!';
        }
    };
}

Validator.isEmail = function(selector, errorMessage) 
{
    return {
        selector: selector,
        test: function (value) 
        {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(String(value).toLowerCase()) ? undefined : errorMessage || 'Trường này phải là Email!';
        }
    };
}

Validator.isPassword = function (selector, lenghtValue, errorMessage) 
{
    return {
        selector: selector,
        test: function (value) 
        {
            return value.length >= lenghtValue ? undefined : errorMessage || `Trường này phải là ${lenghtValue} ký tự!`;
        }
    };
}

Validator.isConfirm = function (selector, confirmValue, errorMessage) 
{
    return {
        selector: selector,
        test: function (value) 
        {
            return value === confirmValue() ? undefined : errorMessage;
        }
    };
}