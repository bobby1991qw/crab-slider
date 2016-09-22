; (function (window, document) {
    function Slider() {
        const utils = {
            extends(dest, source) {
                const args = this.toArray(arguments);

                if (args.length > 2) {
                    return this.extends.apply(this, args.slice(1));
                } else {
                    for (let key in source) {
                        if (source.hasOwnProperty(key)) {
                            dest[key] = source[key];
                        }
                    }

                    return dest;
                }
            },
            createElement(tagname, attrs) {
                const ele = document.createElement(tagname);

                for (let key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        ele[key] = attrs[key];
                    }
                }

                return ele;
            },
            toArray(arrLike, startIndex = 0, endIndex = arrLike.length) {
                return [].slice.call(arrLike, startIndex, endIndex);
            },
            getAgent() {
                const agent = navigator.userAgent,
                    androidExp = /(Android);?[\s\/]+([\d.]+)?/,
                    iosExp = /(iPad|iPhone).*OS\s([\d_]+)/,
                    isAndroid = androidExp.test(agent),
                    isIOS = iosExp.test(agent),
                    isMobile = isAndroid || isIOS;

                return {
                    agent,
                    isAndroid,
                    isIOS,
                    isMobile
                };
            },
            addEventListener(context, type, node, cb, ) {
                if (context.nodeType !== 1) {
                    throw new Error('未找到事件节点');
                }

                if (ctrl.agent.isMobile) {
                    type = {
                        'click': 'touchend'
                    }[type] || type;
                }

                if (arguments.length = 3) {
                    cb = node;

                    context.addEventListener(type, cb.bind(context));
                } else {
                    context.addEventListener(type, (e) => {
                        if ([].indexOf.call(utils.toArray(context.querySelectorAll(node)), e.target) > -1) {
                            cb.apply(context, arguments);
                        }
                    });
                }
            }
        }

        const data = {
            imgs: [],
            currentIndex: 0,
            lastIndex: 0,
            initImgs(imgs) {
                const index = ctrl.options.startIndex;
                this.imgs = imgs;
                this.currentIndex = index;
                this.lastIndex = index;
            },
            changeImg(index) {
                this.lastIndex = this.currentIndex;
                this.currentIndex = index;
            }
        }

        const ui = {
            initUI() {
                const root = ctrl.root,
                    opts = ctrl.options;

                root.classList.add('crab-slider');
                root.style.width = opts.width;
                root.style.height = opts.height;

                opts.showPagination && this.initPagination();
                ctrl.agent.isMobile || this.initChangePage();
            },
            initPagination() {
                const opts = ctrl.options,
                    pagination = utils.createElement('ui', {
                        className: 'crab-pagination'
                    }),
                    style = utils.createElement('style', {
                        innerText: `.crab-slider .pagination-item.active{ background: ${opts.activeColor}; }`
                    });

                data.imgs.forEach((e, i) => {
                    const point = utils.createElement('li', {
                        className: `pagination-item ${i === opts.startIndex ? 'active' : ''}`
                    });

                    pagination.appendChild(point);
                });

                ctrl.root.appendChild(pagination);
            },
            initChangePage() {
                const root = ctrl.root,
                    currentIndex = data.currentIndex,
                    width = parseInt(window.getComputedStyle(root).width) * 0.05,
                    prevPane = utils.createElement('div', {
                        className: 'prevPane'
                    }),
                    prev = this.prev = utils.createElement('span', {
                        className: 'crab-prev'
                    }),
                    nextPane = utils.createElement('div', {
                        className: 'nextPane'
                    }),
                    next = this.next = utils.createElement('span', {
                        className: 'crab-next'
                    });

                prev.style.height = `${width}px`;
                prev.style.width = `${width}px`;
                next.style.height = `${width}px`;
                next.style.width = `${width}px`;

                if (currentIndex === 0) {
                    prev.style.display = 'none';
                }

                if (currentIndex === data.imgs.length - 1) {
                    next.style.display = 'none';
                }

                prevPane.appendChild(prev);
                nextPane.appendChild(next);
                root.appendChild(prevPane);
                root.appendChild(nextPane);
            },
            changeImg() {
                const currentIndex = data.currentIndex,
                    box = ctrl.root.querySelector('.crab-box');

                box.style.transform = `translateX(${-data.currentIndex * 100}%)`;


                if (!ctrl.agent.isMobile) {
                    this.prev.style.display = 'inline-block';
                    this.next.style.display = 'inline-block';
                    if (currentIndex === 0) {
                        this.prev.style.display = 'none';
                    }

                    if (currentIndex === data.imgs.length - 1) {
                        this.next.style.display = 'none';
                    }
                }

                if (ctrl.options.showPagination) {
                    const pagination = utils.toArray(ctrl.root.querySelectorAll('.pagination-item'));

                    pagination[data.lastIndex].classList.remove('active');
                    pagination[data.currentIndex].classList.add('active');
                }
            }
        }

        const ctrl = {
            defaults: {
                width: '100%',
                height: 'auto',
                imgs: [],
                startIndex: 0,
                activeColor: '#ffd439',
                showPagination: true
            },
            move: {
                start: false,
                x: 0,
                y: 0
            },
            init(ele, opts) {
                if (!ele) {
                    throw new Error('未传入初始化元素');
                }

                if (ele.nodeType !== 1) {
                    throw new Error('初始化元素必须为node节点');
                }

                this.root = ele;
                const agent = this.agent = utils.getAgent();
                if (!agent.isMobile) {
                    this.root.classList.add('pc');
                }
                this.options = utils.extends({}, this.defaults, opts);

                this.initImgs();
                ui.initUI();
                this.bindEvent();

                return {
                    init: this.init.bind(this),
                    jumpTo: this.changeImg.bind(this),
                    imgs: data.imgs.map(img => (img.src)),
                    currentImg: data.currentIndex,
                    prev: this.prev.bind(this),
                    next: this.next.bind(this)
                };
            },
            initImgs() {
                const box = utils.createElement('div', {
                    className: 'crab-box'
                });
                let imgs = utils.toArray(this.root.querySelectorAll('img'));

                if (!imgs.length) {
                    imgs = this.options.imgs.map((img) => {
                        return utils.createElement('img', {
                            src: img
                        });
                    });
                }

                imgs.forEach((img) => {
                    box.appendChild(img);
                });

                box.style.transform = `translateX(${-this.options.startIndex * 100}%)`
                this.root.appendChild(box);
                data.initImgs(imgs);
            },
            bindEvent() {
                if (!this.agent.isMobile) {
                    utils.addEventListener(ui.prev, 'click', (e) => {
                        this.prev();
                    });

                    utils.addEventListener(ui.next, 'click', (e) => {
                        this.next();
                    });
                } else {
                    const root = this.root;

                    utils.addEventListener(root, 'touchstart', (e) => {
                        const box = this.root.querySelector('.crab-box');
                        this.translateX = box.style.transform.match(/-?\d+/)[0] - 0;

                        this.move = {
                            start: true,
                            x: e.touches[0].clientX,
                            y: e.touches[0].clientY,
                        };

                        console.log(this.move);
                    });

                    utils.addEventListener(root, 'touchmove', (e) => {
                        const box = this.root.querySelector('.crab-box'),
                            x = e.changedTouches[0].clientX,
                            distance = x - this.move.x,
                            disAbs = Math.abs(distance),
                            dir = distance > 0 ? 1 : -1;

                        box.style.transform = `translateX(${dir * (Math.sqrt(disAbs) + disAbs / 30) + this.translateX}%)`;
                    });

                    utils.addEventListener(root, 'touchend', (e) => {
                        const box = this.root.querySelector('.crab-box'),
                            x = e.changedTouches[0].clientX,
                            distance = x - this.move.x,
                            changMethod = distance > 0 ? this.prev : this.next;


                        console.log(distance);
                        this.move.start = false;


                        box.style.transition = 'all .25s ease-in-out';
                        if ((data.currentIndex !== 0 || distance < 0) && (data.currentIndex !== data.imgs.length - 1 || distance > 0) && Math.abs(distance) > 100) {
                            changMethod.call(this);
                        } else {
                            box.style.transform = `translateX(${this.translateX}%)`;

                        }

                        setTimeout(() => {
                            box.style.transition = 'none';
                        }, 250);
                    })
                }
            },
            changeImg(i) {
                if (i >= data.imgs.length) {
                    throw new Error('超出索引');
                }

                if (i !== data.currentIndex) {
                    data.changeImg(i);
                    ui.changeImg();
                }
            },
            prev() {
                if (data.currentIndex > 0) {
                    this.changeImg(data.currentIndex - 1);
                }
            },
            next() {
                const length = data.imgs.length;

                if (data.currentIndex < length - 1) {
                    this.changeImg(data.currentIndex + 1);
                }
            }
        }

        this.init = ctrl.init.bind(ctrl);
    }

    window.Slider = new Slider();
})(window, document);