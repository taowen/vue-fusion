# vue 3 renderer

VNode => HNode <=> JNode

* HNode tree (more lightweight than fake DOM) to hold render result
* encode/decode JNode (JSON), to send view update, or stash view state for later re-render