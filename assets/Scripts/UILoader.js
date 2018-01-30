function initRetain(texture) {
    if (texture.retain == null) {
        texture.retain = 0;
    }
}

function initSceneRetain(texture) {
    if (texture) {
        if (texture.bk_retain == undefined || texture.bk_retain == null) {
            texture.bk_retain = 1;
            return false;
        } else {
            return true;
        }
    }
    return false;
}
/**
 * 对场景上自带的资源进行引用计数
 * @param {*} node 计数的对象
 * @param {*} number 计数值
 */
function parserPrefab(node, number) {
    // if (!(node instanceof cc.Scene)) {
    //     parserPrefabNode(node, number);
    // }

    let children = node._children;
    children.forEach((child) => {
        parserPrefabNode(child, number);
        parserPrefab(child, number);
    });
}

function parserPrefabNode(node, number) {
    let sprite = node.getComponent(cc.Sprite);
    if (sprite && sprite.spriteFrame) {
        initRetain(cc.loader._cache[sprite.spriteFrame._textureFilename]);
        cc.loader._cache[sprite.spriteFrame._textureFilename].retain += number;
    }

    let button = node.getComponent(cc.Button);
    if (button) {
        if (button.normalSprite) {
            initRetain(cc.loader._cache[button.normalSprite._textureFilename]);
            cc.loader._cache[button.normalSprite._textureFilename].retain += number;
        }

        if (button.pressedSprite) {
            initRetain(cc.loader._cache[button.pressedSprite._textureFilename]);
            cc.loader._cache[button.pressedSprite._textureFilename].retain += number;
        }

        if (button.hoverSprite) {
            initRetain(cc.loader._cache[button.hoverSprite._textureFilename]);
            cc.loader._cache[button.hoverSprite._textureFilename].retain += number;
        }

        if (button.disabledSprite) {
            initRetain(cc.loader._cache[button.disabledSprite._textureFilename]);
            cc.loader._cache[button.disabledSprite._textureFilename].retain += number;
        }
    }

    let label = node.getComponent(cc.Label);
    if (label && label.font && label.font instanceof cc.BitmapFont && label.font.spriteFrame) {
        initRetain(cc.loader._cache[label.font.spriteFrame._textureFilename]);
        cc.loader._cache[label.font.spriteFrame._textureFilename].retain += number;
    }

    let richText = node.getComponent(cc.RichText);
    if (richText && richText.imageAtlas) {
        let keys = Object.keys(richText.imageAtlas._spriteFrames);
        if (keys.length > 0) {
            initRetain(cc.loader._cache[richText.imageAtlas._spriteFrames[keys[0]]._textureFilename]);
            cc.loader._cache[richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].retain += number;
        }
    }

    let particleSystem = node.getComponent(cc.ParticleSystem);
    if (particleSystem && particleSystem._texture) {
        initRetain(cc.loader._cache[particleSystem._texture]);
        cc.loader._cache[particleSystem._texture].retain += number;
    }

    let pageViewIndicator = node.getComponent(cc.PageViewIndicator);
    if (pageViewIndicator && pageViewIndicator.spriteFrame) {
        initRetain(cc.loader._cache[pageViewIndicator.spriteFrame._textureFilename]);
        cc.loader._cache[pageViewIndicator.spriteFrame._textureFilename].retain += number;
    }

    let editBox = node.getComponent(cc.EditBox);
    if (editBox && editBox.backgroundImage) {
        initRetain(cc.loader._cache[editBox.backgroundImage._textureFilename]);
        cc.loader._cache[editBox.backgroundImage._textureFilename].retain += number;
    }

    let mask = node.getComponent(cc.Mask);
    if (mask && mask.spriteFrame) {
        initRetain(cc.loader._cache[mask.spriteFrame._textureFilename]);
        cc.loader._cache[mask.spriteFrame._textureFilename].retain += number;
    }
}
/**
 * 解析静态资源
 * @param {*} item 
 * @param {*} tag 
 */
function parseStaticRes(item, tag) {
    if (item instanceof cc.Texture2D) {
        cc.loader._cache[item.url].isStatic = true;
        cc.loader._cache[item.url].cusTag = tag;
    } else if (item instanceof cc.SpriteFrame) {
        cc.loader._cache[item._textureFilename].isStatic = true;
        cc.loader._cache[item._textureFilename].cusTag = tag;
    } else if (item instanceof cc.Prefab) {
        parseStaticPrefab(item, tag);
    } else if (item instanceof cc.BitmapFont) {
        cc.loader._cache[item.spriteFrame._textureFilename].isStatic = true;
        cc.loader._cache[item.spriteFrame._textureFilename].cusTag = tag;
    } else if (item instanceof cc.SpriteAtlas) {
        var keys = Object.keys(item._spriteFrames)
        keys.forEach((key) => {
            cc.loader._cache[item._spriteFrames[key]._textureFilename].isStatic = true;
            cc.loader._cache[item._spriteFrames[key]._textureFilename].cusTag = tag;
        });
    } else if (item instanceof cc.AnimationClip) {
        cc.log('AnimationClip 资源加载未做处理');
    } else if (item instanceof Object && item.name) {
        cc.log('Object 资源加载未做处理');
    }
}
/**
 * 解析静态预制体
 * @param {*} node 
 * @param {*} tag 
 */
function parseStaticPrefab(node, tag) {
    var prefab = node;
    if (node.data) {
        prefab = node.data;
    }

    if (!(prefab instanceof cc.Scene)) {
        parseStaticNode(prefab, tag);
    }
    let children = prefab._children;
    children.forEach((child) => {
        parseStaticNode(child, tag);
        parseStaticPrefab(child, tag);
    });
}
/**
 * 解析静态节点
 * @param {*} node 
 * @param {*} tag 
 */
function parseStaticNode(node, tag) {
    let sprite = node.getComponent(cc.Sprite);
    if (sprite && sprite.spriteFrame) {
        if (_isNullObj(cc.loader._cache[sprite.spriteFrame._textureFilename])) {
            cc.loader._cache[sprite.spriteFrame._textureFilename].isStatic = true;
            cc.loader._cache[sprite.spriteFrame._textureFilename].cusTag = tag;
        }
    }

    let button = node.getComponent(cc.Button);
    if (button) {
        if (button.normalSprite) {
            if (_isNullObj(cc.loader._cache[button.normalSprite._textureFilename])) {
                cc.loader._cache[button.normalSprite._textureFilename].isStatic = true;
                cc.loader._cache[button.normalSprite._textureFilename].cusTag = tag;
            }
        }

        if (button.pressedSprite) {
            if (_isNullObj(cc.loader._cache[button.pressedSprite._textureFilename])) {
                cc.loader._cache[button.pressedSprite._textureFilename].isStatic = true;
                cc.loader._cache[button.pressedSprite._textureFilename].cusTag = tag;
            }
        }

        if (button.hoverSprite) {
            if (_isNullObj(cc.loader._cache[button.hoverSprite._textureFilename])) {
                cc.loader._cache[button.hoverSprite._textureFilename].isStatic = true;
                cc.loader._cache[button.hoverSprite._textureFilename].cusTag = tag;
            }
        }

        if (button.disabledSprite) {
            if (_isNullObj(cc.loader._cache[button.disabledSprite._textureFilename])) {
                cc.loader._cache[button.disabledSprite._textureFilename].isStatic = true;
                cc.loader._cache[button.disabledSprite._textureFilename].cusTag = tag;
            }
        }
    }

    let label = node.getComponent(cc.Label);
    if (label && label.font && label.font instanceof cc.BitmapFont && label.font.spriteFrame) {
        if (_isNullObj(cc.loader._cache[label.font.spriteFrame._textureFilename])) {
            cc.loader._cache[label.font.spriteFrame._textureFilename].isStatic = true;
            cc.loader._cache[label.font.spriteFrame._textureFilename].cusTag = tag;
        }
    }

    let richText = node.getComponent(cc.RichText);
    if (richText && richText.imageAtlas) {
        let keys = Object.keys(richText.imageAtlas._spriteFrames);
        if (keys.length > 0) {
            if (_isNullObj(cc.loader._cache[richText.imageAtlas._spriteFrames[keys[0]]._textureFilename])) {
                cc.loader._cache[richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].isStatic = true;
                cc.loader._cache[richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].cusTag = tag;
            }
        }
    }

    let particleSystem = node.getComponent(cc.ParticleSystem);
    if (particleSystem && particleSystem._texture) {
        if (_isNullObj(cc.loader._cache[particleSystem._texture])) {
            cc.loader._cache[particleSystem._texture].isStatic = true;
            cc.loader._cache[particleSystem._texture].cusTag = tag;
        }
    }

    let pageViewIndicator = node.getComponent(cc.PageViewIndicator);
    if (pageViewIndicator && pageViewIndicator.spriteFrame) {
        if (_isNullObj(cc.loader._cache[pageViewIndicator.spriteFrame._textureFilename])) {
            cc.loader._cache[pageViewIndicator.spriteFrame._textureFilename].isStatic = true;
            cc.loader._cache[pageViewIndicator.spriteFrame._textureFilename].cusTag = tag;
        }
    }

    let editBox = node.getComponent(cc.EditBox);
    if (editBox && editBox.backgroundImage) {
        if (_isNullObj(cc.loader._cache[editBox.backgroundImage._textureFilename])) {
            cc.loader._cache[editBox.backgroundImage._textureFilename].isStatic = true;
            cc.loader._cache[editBox.backgroundImage._textureFilename].cusTag = tag;
        }
    }

    let mask = node.getComponent(cc.Mask);
    if (mask && mask.spriteFrame) {
        if (_isNullObj(cc.loader._cache[mask.spriteFrame._textureFilename])) {
            cc.loader._cache[mask.spriteFrame._textureFilename].cusTag = tag;
            cc.loader._cache[mask.spriteFrame._textureFilename].isStatic = true;
        }
    }
}

/**
 * 深拷贝一个对象
 * @param {*} obj 
 */
function deepCloneObj(obj) {
    if (typeof obj !== 'object') return obj;
    var i;
    var o = Array.isArray(obj) ? [] : {};
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === "Object" ? deepCloneObj(obj[i]) : obj[i];
        }
    }
    return o;
}

function releaseNodeRes() {

    var dependAssets = cc.director.getScene().dependAssets;

    var texturesInCache = deepCloneObj(cc.loader._cache);

    var release_key = [];

    for (var asset in texturesInCache) {

        if (texturesInCache[asset].isStatic) {
            continue;
        }

        // if (dependAssets.indexOf(asset) !== -1) {
        //     continue;
        // }

        if (texturesInCache[asset].retain <= 0) {
            release_key.push(texturesInCache[asset].url);
            cc.loader.release(texturesInCache[asset].url);
        }
    }

    var release_json = [];
    for (var asset in cc.loader._cache) {
        if (cc.loader._cache[asset].dependKeys && cc.loader._cache[asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader._cache[asset].dependKeys.length; i++) {
                if (release_key.indexOf(cc.loader._cache[asset].dependKeys[i]) !== -1) {
                    is_release = true;

                }
            }

            if (is_release) {
                release_json.push(cc.loader._cache[asset].url);
                cc.loader.release(cc.loader._cache[asset].url);
            }
        }
    }

    for (var asset in cc.loader._cache) {
        if (cc.loader._cache[asset].dependKeys && cc.loader._cache[asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader._cache[asset].dependKeys.length; i++) {
                if (release_json.indexOf(cc.loader._cache[asset].dependKeys[i]) !== -1) {
                    is_release = true;

                }
            }

            if (is_release) {
                cc.loader.release(cc.loader._cache[asset].url);
            }
        }
    }
    release_key = [];
}

function releaseStaticRes(tag) {

    var dependAssets = cc.director.getScene().dependAssets;

    var texturesInCache = deepCloneObj(cc.loader._cache);

    var release_key = [];

    for (var asset in texturesInCache) {
        if (tag) {
            if (texturesInCache[asset].cusTag != tag) {
                continue;
            }
        }

        if (texturesInCache[asset].retain > 0 && texturesInCache[asset].isStatic) {
            cc.log(`${asset} 还在使用中..., 该纹理不会释放`);
            continue;
        }
        // if (texturesInCache[asset].isStatic) {
        //     texturesInCache[asset].retain -= 1;
        // }

        if (texturesInCache[asset].retain <= 0) {
            release_key.push(texturesInCache[asset].url);
            cc.loader.release(texturesInCache[asset].url);
        }
    }

    var release_json = [];

    for (var asset in cc.loader._cache) {
        if (cc.loader._cache[asset].dependKeys && cc.loader._cache[asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader._cache[asset].dependKeys.length; i++) {
                if (release_key.indexOf(cc.loader._cache[asset].dependKeys[i]) !== -1) {
                    is_release = true;

                }
            }

            if (is_release) {
                release_json.push(cc.loader._cache[asset].url);
                cc.loader.release(cc.loader._cache[asset].url);
            }
        }
    }


    for (var asset in cc.loader._cache) {
        if (cc.loader._cache[asset].dependKeys && cc.loader._cache[asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader._cache[asset].dependKeys.length; i++) {
                if (release_json.indexOf(cc.loader._cache[asset].dependKeys[i]) !== -1) {
                    is_release = true;

                }
            }

            if (is_release) {
                cc.loader.release(cc.loader._cache[asset].url);
            }
        }
    }
    release_key = [];
}

function replaceButtonTexture(target, normalSprite, newNormalSprite) {
    if (target[normalSprite]) {
        initRetain(cc.loader._cache[target[normalSprite]._textureFilename]);
        cc.loader._cache[target[normalSprite]._textureFilename].retain -= 1;
    }

    initRetain(cc.loader._cache[newNormalSprite._textureFilename]);
    cc.loader._cache[newNormalSprite._textureFilename].retain += 1;
    target[normalSprite] = newNormalSprite;
}

var key_map = {};
var audioPath = null;

const UILoader = {

    /**
     * 加载一个资源
     * @param {*} path  资源路径
     * @param {*} type  资源类型
     * @param {*} callback  回调函数
     */
    loadRes(path, type, callback) {
        cc.loader.loadRes(path, type, (err, asset) => {
            if (err) {
                cc.log(`[资源加载] 错误 ${err}`);
                return;
            }
            callback(asset)
        });
    },


    /**
     * 加载一个静态资源
     * @param {string} path  资源路径
     * @param {*} type 资源类型
     * @param {*} tag 静态资源的标签
     * @param {Function} callback 回调函数
     */
    loadStaticRes(path, type, tag, callback) {
        if (!path || !type || !callback) {
            cc.log("参数错误");
            return;
        }
        cc.loader.loadRes(path, type, (err, asset) => {
            if (err) {
                cc.log(`[资源加载] 错误 ${err}`);
                return;
            }
            callback(asset)
            parseStaticRes(asset, tag);
        });
    },


    /**
     * 对场景自身携带的资源进行引用计数统计
     * @param {*} scene 
     */
    retainScene(scene) {
        parserPrefab(scene, 1);
    },

    /**
     * 更新Sprite纹理
     * @param {Object} target  目标节点
     * @param {cc.SpriteFrame} spriteFrame  更新的纹理
     */
    replaceSpriteTexture(target, spriteFrame) {
        if (!target || !spriteFrame) {
            cc.log("参数错误")
            return;
        }

        if (!target.getComponent(cc.Sprite)) {
            cc.log("目标节点没有Sprite组件");
            return;
        }

        let sprite = target.getComponent(cc.Sprite);

        replaceButtonTexture(sprite, "spriteFrame", spriteFrame);

        releaseNodeRes();
    },

    /**
     * 更新Button纹理
     * @param {*} target 目标节点
     * @param {*} normalSprite 更新默认纹理
     * @param {*} pressedSprite 更新按下纹理(可以为null)
     * @param {*} hoverSprite 更新鼠标进入纹理(可以为null)
     * @param {*} disabledSprite 更新不可用纹理(可以为null) 
     */
    replaceButtonTexture(target, normalSprite, pressedSprite, hoverSprite, disabledSprite) {
        if (!target || !normalSprite) {
            cc.log("参数错误")
            return;
        }

        if (!target.getComponent(cc.Button)) {
            cc.log("目标节点没有Button组件");
            return;
        }

        let button = target.getComponent(cc.Button);
        if (normalSprite) {
            replaceButtonTexture(button, "normalSprite", normalSprite);
        }

        if (pressedSprite) {
            replaceButtonTexture(button, "pressedSprite", pressedSprite);
        }

        if (hoverSprite) {
            replaceButtonTexture(button, "hoverSprite", hoverSprite);
        }

        if (disabledSprite) {
            replaceButtonTexture(button, "disabledSprite", disabledSprite);
        }

        releaseNodeRes();
    },

    /**
     * 实例化预制体
     * @param {*} prefab  预制体
     * @param {*} target  目标节点
     * @param {*} callback 回调函数
     */
    instantiate(prefab, target, callback) {
        if (!target || !callback) {
            cc.log("参数不对, 请检查参数");
        }
        let node_prefab = cc.instantiate(prefab);
        target.addChild(node_prefab);
        callback(node_prefab);
        parserPrefab(node_prefab, 1);
    },
    /**
     * 释放静态资源
     * @param {*} tag 
     */
    releaseStaticRes(tag) {
        releaseStaticRes(tag);
    },

    /**
     * 销毁节点
     * @param {cc.Node} node 
     */
    destroy(node) {
        if (!node instanceof cc.Node) {
            cc.log("你要销毁的不是一个节点");
            return;
        }
        parserPrefab(node, -1);
        node.destroy();
        releaseNodeRes();
    },

    /**
     * 场景切换释放资源
     *  一般用在  cc.director.EVENT_BEFORE_SCENE_LOADING加载新场景之前所触发的事件。
     * cc.director.on(cc.director.EVENT_BEFORE_SCENE_LOADING,UILoader.beforeSceneLoading)
     * @param {*} event 
     * @param {*} detail 
     */
    beforeSceneLoading(event, detail) {
        key_map = {};
        var dependAssets = event.currentTarget._scene.dependAssets;
        if (dependAssets && dependAssets.length > 0) {
            for (var i = 0; i < dependAssets.length; i++) {
                if (cc.loader._cache[dependAssets[i]] && cc.loader._cache[dependAssets[i]].isStatic) {
                    key_map[i] = dependAssets[i];
                    delete dependAssets[i];
                }

                if (initSceneRetain(cc.loader._cache[dependAssets[i]])) {
                    cc.loader._cache[dependAssets[i]].retain -= 1;
                }
            }
        }

        var keys = Object.keys(cc.loader._cache);
        keys.forEach((key) => {
            if (cc.loader._cache[key] && !cc.loader._cache[key].isStatic && cc.loader._cache[key].retain > 0) {
                if (initSceneRetain(cc.loader._cache[key])) {
                    cc.loader._cache[key].retain = 0;
                }
            }
        });
    },
    /**
     * 场景切换释放资源
     *  cc.director.EVENT_BEFORE_SCENE_LAUNCH 运行新场景之前所触发的事件
     *  cc.director.on(cc.director.EVENT_BEFORE_SCENE_LAUNCH,UILoader.afterSceneLaunch)
     * @param {*} event 
     * @param {*} detail 
     */
    afterSceneLaunch(event, detail) {
        for (var key in key_map) {
            event.currentTarget._scene.dependAssets[key] = key_map[key];
        }
        var dependAssets = event.currentTarget._scene.dependAssets;
        if (dependAssets && dependAssets.length > 0) {
            for (var i = dependAssets.length - 1; i >= 0; i--) {
                if (cc.loader._cache[dependAssets[i]] && cc.loader._cache[dependAssets[i]].isStatic) {
                    continue;
                }
                if (initSceneRetain(cc.loader._cache[dependAssets[i]])) {
                    cc.loader._cache[dependAssets[i]].retain += 1;
                }

            }
        }
        releaseNodeRes();
    },
    /**
     * 播放一个音效(结束自动删除音效)
     * @param {*} path 音效路径名字
     * @param {*} volume 声音大小
     * @returns 返回音效id
     */
    playEffect(path, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        let audioID = cc.audioEngine.play(path, false, volume);
        //设置一个音频结束后的回调
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.loader.release(cc.loader._cache[ss.target.src].url);
        });
        return audioID;
    },

    /**
     * 播放音乐(结束自动删除音效)
     * @param {string} path 音效路径名字
     * @param {boolean} loop 是否循环
     * @param {number} volume 声音大小
     * @returns 返回音效id
     */
    playMusic(path, loop, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        if (audioPath) {
            cc.loader.release(cc.loader._cache[audioPath].url);
        }
        audioPath = path;
        let audioID = cc.audioEngine.playMusic(path, loop, volume);
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.log("触发回调函数");
            cc.loader.release(cc.loader._cache[ss.target.src].url);
        });
        return audioID;
    }


};

module.exports = UILoader;