describe("hooks", () => {
    let hooks = [];

    beforeEach(() => {
        hooks = [];
    });
    describe("stored in array", () => {
        it("are accessed in order", () => {
            function withHook() {
                return number();
            }
            let n = render(withHook);
            expect(render(withHook)).toBe(n);
        });
    });

    describe("conditionaly rendered", () => {
        let timesCalled = 0;
        it("access wrong index", () => {
            function broken() {
                let cb1, cb2;
                if(timesCalled === 0) {
                    cb1 = number();
                }
                cb2 = constant();
                timesCalled++;
                return [cb1, cb2];
            }

            const [n1, n2] = render(broken); // 1 hook!
            const [n11, n22] = render(broken); // undefined 1
            expect(n1).toBe(n11);
            expect(n2).toBe(n22);
        });
    });
    // hookId for renders
    let hookId = -1;

    let result = 0;
    function render(renderFnc) {
        hookId = 0;
        const resultOfRender = renderFnc();
        hookId = -1;
        return resultOfRender;
    }
    function number() {
        const myHookId = hookId++;
        let hook = hooks[myHookId];
        if (hook === undefined) {
            hook = result++;
            hooks[myHookId] = hook;
        }
        return hook;
    }

    function constant() {
        const myHookId = hookId++;
        let hook = hooks[myHookId];
        if (!hook) {
            hook = "hook!!";
            hooks[myHookId] = hook;
        }
        return hook;
    }
});