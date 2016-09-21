; (function (window, document) {
    function Slider() {
        const utils = {

        }

        const data = {

        }

        const ui = {

        }

        const ctrl = {
            init(ele, opts) {
                console.log('init');                
            }
        }

        this.init = ctrl.init.bind(ctrl);
    }

    window.Slider = new Slider();
})(window, document);