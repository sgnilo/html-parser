const tagName = '[a-zA-Z]*[a-zA-Z_0-9]*';
const doctype = /^\s?<!DOCTYPE [^>]+>/i;
const openTag = new RegExp(`^\s?<${tagName}[^>]+>`);
const closeTag = new RegExp(`^\s?<\/${tagName}>`);
const commentTag = /^\s?<!--[^\1]+(-->)/;
const selfTag = /^\s?<(meta|link|br|hr|img|input)\s?([^>]+)?\/?>/;
const specialSelfTag = /^\s?<[a-zA-Z]+\s[^>]+\/>/;
const text = /^[^<]+/;
const attribute = /\s[^=]+="[^"]+"/g;
const shortAttr = /\s[^\s="]+\b/g;
const emptyText = /^\s*$/;

class Element {
    constructor(token, type, deep, children) {
        this.token = token;
        this.type = type;
        this.deep = deep;
        this.children = children;
    }

    closeSet(node) {
        const road = this.road.split('-').map(item => parseInt(item, 10));
        const set = [];
        while (road.length && node) {
            set.push(node);
            node = node.children[road.shift()];
        }
        return set;
    }
};

const trim = str => str.replace(/^\s*/, '').replace(/\s*$/, '');

const assignDomTree = (stack) => {
	let preNode = null;
	let rootNode = null
    const xpath = [];
    const road = [];
	while (stack.length) {
		const currentNode = stack.pop();
		if (!preNode) {
			preNode = currentNode;
			rootNode = currentNode;
			continue;
		}
		if (currentNode.deep > preNode.deep) {
            // currentNode.parent = preNode;
			preNode.children.unshift(currentNode);
		} else {
			const parent = findByDeep(rootNode, currentNode.deep - 1);
            // currentNode.parent = parent;
			parent.children.unshift(currentNode);
		}
		preNode = currentNode;
	}
    reduce(rootNode, (currentNode, next, nodeIndex) => {
        const tagName = currentNode.tagName || currentNode.type || '';
        xpath.push(tagName + (nodeIndex || ''));
        road.push(nodeIndex);
        currentNode.xpath = xpath.join('-');
        currentNode.road = road.join('-');
        next();
        xpath.pop();
        road.pop();
    });
	return rootNode;
};

const findByDeep = (node, deep) => {
	if (node.deep === deep) {
		return node;
	} else if (node.deep < deep) {
		return findByDeep(node.children[0], deep);
	} else {
		throw new Error(`查找出错了！deep: ${deep}\t${JSON.stringify({...node, children: []})}`);
	}
};

const makeNode = (token, type, deep, children = []) => {
    const node = new Element(token, type, deep, children);
	if (type === 'comment' || type === 'text') {
		return node;
	}
	const tagName = (token.match(/<[a-zA-Z]*[a-zA-Z_0-9]*(\s|>)/) || [])[0].replace('<', '').replace(/(\s|>)/, '');
	node.tagName = tagName;
	const attributes = token.match(attribute) || [];
	attributes.forEach((attribute) => {
		const attrKV = trim(attribute).replace(/"$/, '').split('="');
		node[attrKV[0]] = attrKV[1];
	});
	const parsedToken = token.replace(attribute, '');
	const shortAttrs = parsedToken.match(shortAttr) || [];
	shortAttrs.forEach(attr => {
		node[trim(attr)] = true;
	});
	return node;
};

const parse = (html) => {
	const clip = (index) => {
		html = html.substring(index);
	};
    const tokenStack = [];
	const eleStack = [];
    while (html) {
		const doctypeMatch = html.match(doctype);
		if (doctypeMatch) {
			clip(doctypeMatch[0].length);
			continue;
		}
		const commentTagMatch = html.match(commentTag);
		if (commentTagMatch) {
			const token = commentTagMatch[0];
			eleStack.push(makeNode(token, 'comment', tokenStack.length));
			clip(token.length);
			continue;
		}
		const slefTagMatch = html.match(selfTag) || html.match(specialSelfTag);
        if (slefTagMatch) {
            // 自闭合标签
			const token = slefTagMatch[0];
			eleStack.push(makeNode(token, 'selfTag', tokenStack.length));
			clip(token.length);
			continue;
        }
		const closeTagMatch = html.match(closeTag) || html.match(specialSelfTag);
		if (closeTagMatch) {
            // 元素闭合标签
			const token = tokenStack.pop();
			if (token) {
				eleStack.push(makeNode(token, 'common', tokenStack.length));
			} else {
				throw new Error(`没有匹配到元素的开始标签！\t${closeTagMatch[0]}`);
			}
			const tagName = closeTagMatch[0].replace(/<\//, '').replace(/>/, '');
			if (token.indexOf(tagName) < 0) {
				throw new Error(`元素开始和闭合标签不对应：\t${closeTagMatch[0]}\t${token}`);
			}
			clip(closeTagMatch[0].length);
			continue;
        }
		const openTagMatch = html.match(openTag);
		if (openTagMatch) {
            // 元素开始标签
			const token = openTagMatch[0];
			tokenStack.push(token);
			clip(token.length);
			continue;
        }
		const textMatch = html.match(text);
		if (textMatch) {
            // 文本
			const token = textMatch[0];
			if (!emptyText.test(token)) {
				eleStack.push(makeNode(token, 'text', tokenStack.length));
			}
			clip(textMatch[0].length);
			continue;
        } else {
          // 不知道是什么
		  throw new Error(`解析失败！\t${html.substring(0, 100)}\t${tokenStack.pop()}\t${JSON.stringify(eleStack.pop())}`);
        }
    }
	return assignDomTree(eleStack);
};

const reduce = (node, reduceCallback, nodeIndex = 0) => {
    if (reduceCallback) {
        reduceCallback(node, () => {
            if (node.children.length) {
                node.children.forEach((child, childId) => reduce(child, reduceCallback, childId));
            }
        }, nodeIndex);
    } else {
        if (node.children.length) {
			node.children.forEach(child => reduce(child, reduceCallback));
		}
    }
};

const stringify = (dom) => {
	let html = '';
    reduce(dom, (currentNode, next) => {
        html += currentNode.token;
        next();
        if (currentNode.type !== 'text' && currentNode.type !== 'comment' && currentNode.type !== 'selfTag') {
            if (!currentNode.tagName) {
                console.log(currentNode);
            }
			html += `</${currentNode.tagName}>`;
		}
    });
	return html;
};

module.exports = {
    stringify,
    parse
};
