
import Actions from '../src/Actions';

describe('Actions', () => {

	describe('constructor', () => {
		it('must be passed a tree', () => {
			expect(() => new Actions()).to.throw(`Must provide a tree object to Actions that encapsulates all application state`);
		});
		it('must be passed a definition', () => {
			expect(() => new Actions({}, '')).to.throw(`Must provide a definition object to Actions that details all actions over the tree`);
		});
	});

	describe('getAllActions function', () => {
		it('should be defined', () => {
			const a = new Actions({}, '', {});
			a.getAllActions().should.eql(a);
		});

		it('should return all actions for a nested node', () => {
			const a = new Actions({}, '', {child: {}});
			a.child.getAllActions().should.eql(a);
		});
	});

	describe('getTree function', () => {
		it('should be defined', () => {
			const tree = {qwe: 123};
			const a = new Actions(tree, '', {});
			a.getTree().should.eql(tree);
		});
	});

	describe('getCursor function', () => {
		it('should not be defined if no path definition has been provided', () => {
			const a = new Actions({}, '', {other: {}});
			expect(a.getCursor).to.not.exist;
		});

		describe('with a path string', () => {
			it('should return the tree value if the path exists', () => {
				const a = new Actions({asd: {qwe: 123}}, '', {path: 'asd.qwe'});
				a.getCursor().should.eql(123);
			});
			it('should return null if the path does not exist', () => {
				const a = new Actions({asd: {qwe: 123}}, '', {path: 'asd.asd'});
				expect(a.getCursor()).to.eql(null);
			});
		});

		describe('with a path array', () => {
			it('should return the tree value if the path exists', () => {
				const a = new Actions({asd: {qwe: 123}}, '', {path: ['asd', 'qwe']});
				a.getCursor().should.eql(123);
			});
			it('should return null if the path does not exist', () => {
				const a = new Actions({asd: {qwe: 123}}, '', {path: ['asd', 'asd']});
				expect(a.getCursor()).to.eql(null);
			});
		});

		describe('with a path function', () => {
			it('should return the tree value if the path exists', () => {
			const a = new Actions({asd: {qwe: 123}}, '', {path: k => ['asd', k]});
				a.getCursor('qwe').should.eql(123);
			});
			it('should return null if the path does not exist', () => {
			const a = new Actions({asd: {qwe: 123}}, '', {path: k => ['asd', k]});
				expect(a.getCursor('asd')).to.eql(null);
			});
			it('should return null if the function is given no argument', () => {
			const a = new Actions({asd: {qwe: 123}}, '', {path: k => ['asd', k]});
				expect(a.getCursor()).to.eql(null);
			});
		});
	});

	describe('getUrl function', () => {
		it('should not be defined if no url definition has been provided', () => {
			const a = new Actions({}, '', {other: {}});
			expect(a.getUrl).to.not.exist;
		});

		describe('with a url string', () => {
			it('should return the url with no base url specified', () => {
				const a = new Actions({}, '', {url: 'theUrl'});
				a.getUrl().should.eql('theUrl');
			});
			it('should return url with a base url specified', () => {
				const a = new Actions({}, 'somePlace/', {url: 'theUrl'});
				a.getUrl().should.eql('somePlace/theUrl');
			});
		});

		describe('with a url function', () => {
			it('should return the url with no base url specified', () => {
				const a = new Actions({}, '', {url: k => `theUrl/${k}`});
				a.getUrl('qwe').should.eql('theUrl/qwe');
			});
			it('should return url with a base url specified', () => {
				const a = new Actions({}, 'somePlace/', {url: (x, y) => `theUrl/${x}/${y}`});
				a.getUrl('qwe', 'asd').should.eql('somePlace/theUrl/qwe/asd');
			});
		});
	});

	describe('action functions', () => {
		it('should throw an error on construction if actions is not an object', () => {
			expect(() => new Actions({}, '', {actions: 123})).to.throw(`Defined actions must to be an object`);
		});
		it('should throw an error on construction if not a function', () => {
			expect(() => new Actions({}, '', {actions: {qwe: 123}})).to.throw(`Action 'qwe' must be a function`);
		});
		it('should run the function on execution', () => {
			const a = new Actions({}, '', {actions: {qwe: x => `action ${x}`}});
			a.qwe(123).should.eql(`action 123`);
		});
		it('should bind the Actions object to this', () => {
			const a = new Actions({}, '', {actions: {qwe: function() { return this; }}});
			a.qwe().should.eql(a);
		});
	});

	describe('default actions', () => {
		it('should throw an error on construction if not defined', () => {
			expect(() => new Actions({}, '', {actions: {qwe: true}})).to.throw(`Default action 'qwe' used but not defined`);
		});
		it('should be applied if the action is exactly true', () => {
			const a = new Actions({}, '', {actions: {qwe: true}}, {qwe: x => `default ${x}`});
			a.qwe(123).should.eql(`default 123`);
		});
		it('should bind the Actions object to this', () => {
			const a = new Actions({}, '', {actions: {qwe: true}}, {qwe: function() { return this; }});
			a.qwe().should.eql(a);
		});
		it('should be overridden if a funciton is provided in the definition', () => {
			const a = new Actions({}, '', {actions: {qwe: x => `override ${x}`}}, {qwe: () => `should override`});
			a.qwe(123).should.eql(`override 123`);
		});
	});

	describe('remaining properties', () => {
		it('should be added to the object as a new instance of Actions', () => {
			const a = new Actions({}, '', {qwe: {}});
			a.qwe.should.to.be.an.instanceof(Actions);
			a.qwe.should.not.eql(a);
		});
		it('should have an encapsulated path definition', () => {
			const a = new Actions({asd: {qwe: 123}}, '', {qwe: {path: 'asd.qwe'}});
			expect(a.getCursor).to.not.exist;
		});
		it('should be created with the entire tree', () => {
			const a = new Actions({asd: {qwe: 123}}, '', {qwe: {path: 'asd.qwe'}});
			a.qwe.getCursor().should.eql(123);
		});
		it('should have access to the entire tree', () => {
			const tree = {asd: {qwe: 123}};
			const a = new Actions(tree, '', {qwe: {path: 'asd.qwe'}});
			a.qwe.getTree().should.eql(tree);
		});
		it('should have an encapsulated url definition', () => {
			const a = new Actions({}, '', {qwe: {url: 'theUrl'}});
			expect(a.getUrl).to.not.exist;
		});
		it('should be created with the entire base url', () => {
			const a = new Actions({}, 'somePlace/', {qwe: {url: 'theUrl'}});
			a.qwe.getUrl().should.eql('somePlace/theUrl');
		});
		it('should have an encapsulated actions definition', () => {
			const a = new Actions({}, '', {actions: {zxc: x => `parent ${x}`}, qwe: {actions: {asd: x => `child ${x}`}}});
			expect(a.asd).to.not.exist;
			a.zxc(123).should.eql(`parent 123`);
			expect(a.qwe.zxc).to.not.exist;
			a.qwe.asd(123).should.eql(`child 123`);
		});
		it('should have encapsulated child definitions', () => {
			const a = new Actions({}, '', {qwe: {asd: {}}});
			expect(a.asd).to.not.exist;
			a.qwe.asd.should.exist;
		});
		it('should be created with the default actions', () => {
			const a = new Actions({}, '', {qwe: {actions: {asd: true}}}, {asd: x => `default ${x}`});
			a.qwe.asd(123).should.eql(`default 123`);
		});
	});
});
