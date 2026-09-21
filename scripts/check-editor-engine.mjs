import assert from 'node:assert/strict';
import {newLayer,poseAt,hitLayer,validateLayers,layerVideoTime} from '../dist/editor-engine.js';
import {validScene} from '../dist/core.js';
const l=newLayer('media/desk.png','책상');l.start=.2;l.end=2;l.motion='drop';l.enter=.4;
assert.equal(poseAt(l,.1),null);assert.ok(poseAt(l,.2).y<0);assert.equal(poseAt(l,.6).y,360);assert.equal(poseAt(l,2),null);assert.equal(poseAt(l,0,true).y,360);
l.motion='none';l.keyframes=[{t:0,x:100,y:200,w:200,h:100,rotation:0,opacity:1,ease:'linear'},{t:1,x:500,y:400,w:400,h:200,rotation:90,opacity:.5,ease:'linear'}];
assert.equal(poseAt(l,.7).x,300);assert.equal(poseAt(l,.7).w,300);assert.ok(hitLayer(l,poseAt(l,.7),300,300));assert.ok(!hitLayer(l,poseAt(l,.7),0,0));
const scene=validScene({id:1,layers:[l],duration:2.5});assert.deepEqual(scene.layers,validateLayers([l]));assert.equal(scene.duration,2.5);assert.equal(layerVideoTime({...l,clipStart:2},.7,10),2.5);assert.ok(layerVideoTime(l,100,3)<3);assert.throws(()=>validateLayers([{asset:'../../secret'}]));assert.throws(()=>validateLayers([l,l]));assert.throws(()=>validateLayers([{...l,end:.1}]));
console.log('PASS layer entry timing, deterministic keyframe interpolation, rotated hit testing, scene round trip, independent video offset and validation');
