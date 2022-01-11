import React from 'react';
import ApiHelper from '../utils/ApiHelper';
import config from '../config/config';
import {toast} from 'react-toastify';

export default class MediaPoolConfig extends React.Component {
    constructor(props) {
        super(props);

        this.audioDataRef = React.createRef();
        this.videoDataRef = React.createRef();
        this.imageDataRef = React.createRef();

        this.state = {
            videoPool: [],
            audioPool: [],
            imagePool: [],
            uploadVideoData: "",
            uploadAudioData: "",
            uploadImageData: "",
            uploadVideoDataUrl: "",
            uploadAudioDataUrl: "",
            uploadImageDataUrl: "",
            addVideoUrl: "",
            addAudioUrl: "",
            addImageUrl: "",
            uploadVideoFileName: "",
            uploadAudioFileName: "",
            uploadImageFileName: "",
            selectedAudioIndex: -1,
            selectedVideoIndex: -1,
            selectedImageIndex: -1,
            videoPreview: {},
            audioPreview: {},
            imagePreview: {},
            saving: false
        }
    }

    componentDidMount = async () => {
        try {
            await this.loadMediaData();
        } catch (e) {
            console.error(e);
        }
    }

    loadMediaData = async () => {
        let {videoPool, audioPool, imagePool} = await ApiHelper.getBot(this.props.channel);
        this.setState({videoPool, audioPool, imagePool});
    }

    onFileLoaded = (e) => {
        let fr = new FileReader();
        let file = e.target.files[0];

        const uploadFileName = file.name;
        const lastDot = uploadFileName.lastIndexOf('.');
        const ext = uploadFileName.substring(lastDot + 1);

        fr.onload = () => {
            let base64Media = fr.result.substring(fr.result.indexOf(',') + 1);

            if (ext === "mp4") {
                this.setState({uploadVideoData: base64Media, uploadVideoDataUrl: fr.result, uploadVideoFileName: uploadFileName});
            } else if (ext === "mp3") {
                this.setState({uploadAudioData: base64Media, uploadAudioDataUrl: fr.result, uploadAudioFileName: uploadFileName});
            } else if (ext === "gif") {
                this.setState({uploadImageData: base64Media, uploadImageDataUrl: fr.result, uploadImageFileName: uploadFileName});
            }
        }

        fr.readAsDataURL(file);
    }

    onDisableMedia = async (e, type, index) => {
        let mediaPool = {};
        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else if (type === "image") {
            mediaPool = [...this.state.imagePool];
        } else {
            return;
        }

        mediaPool[index].enabled = e.target.checked;

        try {
            if (type === "audio") {
                this.setState({audioPool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "audio", mediaPool);
            } else if (type === "video") {
                this.setState({videoPool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "video", mediaPool);
            } else if (type === "image") {
                this.setState({imagePool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "image", mediaPool);
            }  else {
                return;
            }
            toast(`Disabled media`, {type: "info"});
            this.setState({saving: false});
        } catch(e) {
            console.error(e);
            toast("Failed to update media pool!");
            return;
        }
    }

    onDeleteMedia = async (type, index) => {
        let mediaPool = {};
        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else if (type === "image") {
            mediaPool = [...this.state.imagePool];
        }  else {
            return;
        }

        mediaPool.splice(index, 1);

        try {
            if (type === "audio") {
                this.setState({audioPool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "audio", mediaPool);
            } else if (type === "video") {
                this.setState({videoPool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "video", mediaPool);
            } else if (type === "image") {
                this.setState({imagePool: mediaPool, saving: true});
                await ApiHelper.updateBotMediaPool(this.props.channel, "image", mediaPool);
            }  else {
                return;
            }
            toast(`Deleted media`, {type: "info"});
            this.setState({saving: false});
        } catch(e) {
            console.error(e);
            toast("Failed to update media pool!")
            return;
        }
    }

    storeMedia = async (type) => {
        let mediaPool = {};
        let mediaData = {};
        let mediaUrl = "";
        if (type === "audio") {
            mediaData.mimeType = "audio/mp3";
            mediaData.imagePayload = this.state.uploadAudioData;
            mediaData.title = this.state.uploadAudioFileName;
            mediaPool = [...this.state.audioPool];
            mediaUrl = this.state.addAudioUrl;
        } else if (type === "video") {
            mediaData.mimeType = "video/mp4";
            mediaData.imagePayload = this.state.uploadVideoData;
            mediaData.title = this.state.uploadVideoFileName;
            mediaPool = [...this.state.videoPool];
            mediaUrl = this.state.addVideoUrl;
        } else if (type === "image") {
            mediaData.mimeType = "image/gif";
            mediaData.imagePayload = this.state.uploadImageData;
            mediaData.title = this.state.uploadImageFileName;
            mediaPool = [...this.state.imagePool];
            mediaUrl = this.state.addImageUrl;
        } else {
            return;
        }

        this.setState({saving: true});
        if (!this.state.addAudioUrl && !this.state.addVideoUrl && !this.state.addImageUrl) {
            try {
                let {_id} = await ApiHelper.storeMedia(mediaData);
                mediaPool.push({
                    name: type + (mediaPool.length + 1),
                    url: `${config.MEDIA_SERVER_URL}/media/${_id}/file`
                });
            } catch (e) {
                console.error(e);
                toast("Failed to store video file!")
                return;
            }
        } else {
            mediaPool.push({
                name: type + (mediaPool.length + 1),
                url: mediaUrl
            });
        }

        try {
            await ApiHelper.updateBotMediaPool(this.props.channel, type, mediaPool);
        } catch (e) {
            console.error(e);
            toast("Failed to update media pool!")
            return;
        }
        toast(`Media stored successfully`, {type: "info"});
        this.setState({saving: false});

        this.audioDataRef.current.value = null;
        this.videoDataRef.current.value = null;
        this.imageDataRef.current.value = null;

        this.setState({uploadAudioData: "", uploadAudioDataUrl: "", uploadAudioFileName: "", uploadVideoData: "", uploadVideoDataUrl: "", uploadVideoFileName: "", uploadImageData: "", uploadImageDataUrl: "", uploadImageFileName: ""});
        this.loadMediaData();
    }

    updateMedia = (e, index, type) => {
        let mediaPool = [];

        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else if (type === "image") {
            mediaPool = [...this.state.imagePool];
        }  else {
            return;
        }

        mediaPool[index].name = e.target.value;

        if (type === "audio") {
            this.setState({audioPool: mediaPool});
        } else if (type === "video") {
            this.setState({videoPool: mediaPool});
        } else if (type === "image") {
            this.setState({imagePool: mediaPool});
        } else {
            return;
        }
    }

    updateChromaKey = (e, index, type) => {
        let mediaPool = [];

        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else {
            return;
        }

        mediaPool[index].chromaKey = e.target.value;

        if (type === "audio") {
            this.setState({audioPool: mediaPool});
        } else if (type === "video") {
            this.setState({videoPool: mediaPool});
        } else {
            return;
        }
    }

    updateVolume = (e, index, type) => {
        let mediaPool = [];

        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else {
            return;
        }

        mediaPool[index].volume = parseFloat(e.target.value);

        if (type === "audio") {
            this.setState({audioPool: mediaPool});
        } else if (type === "video") {
            this.setState({videoPool: mediaPool});
        } else {
            return;
        }
    }

    updatePosition = (e, index, portion, type) => {
        let mediaPool = [];

        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else {
            return;
        }

        mediaPool[index][portion] = e.target.value;

        if (type === "audio") {
            this.setState({audioPool: mediaPool});
        } else if (type === "video") {
            this.setState({videoPool: mediaPool});
        } else {
            return;
        }
    }

    saveMediaConfig = async (type) => {
        let mediaPool = [];

        if (type === "audio") {
            mediaPool = [...this.state.audioPool];
        } else if (type === "video") {
            mediaPool = [...this.state.videoPool];
        } else if (type === "image") {
            mediaPool = [...this.state.imagePool];
        } else {
            return;
        }

        try {
            this.setState({saving: true});
            await ApiHelper.updateBotMediaPool(this.props.channel, type, mediaPool);
            this.setState({saving: false});
            toast(`Media config save successful`, {type: "info"});
        } catch (e) {
            console.error(e);
            toast("Failed to save media pool config!")
            return;
        }
    }

    render() {
        return (
            <div>
                <div style={{display: "table"}}>
                    <div style={{display: "table-cell"}}>
                        <h3>My Audio</h3>
                        <ul>
                            { this.state.audioPool.map((element, index) => {
                                if (!element.volume) {
                                    element.volume = 1.0;
                                }
                                
                                return (
                                    <li>
                                        <input type="checkbox" onChange={(e) => {this.onDisableMedia(e, "audio", index)}} checked={element.enabled} disabled={this.state.saving}/>
                                        <button onClick={() => {this.onDeleteMedia("audio", index)}}>X</button>
                                        <span className={this.state.audioPreview === element.url  ? "selected" : ""} style={{cursor: "pointer"}}>
                                            <input type="text" value={element.name} onChange={(e) => {this.updateMedia(e, index, "audio")}} onBlur={() => {this.saveMediaConfig("audio")}} disabled={this.state.saving} />
                                            <input type="range" min={0} max={1} step={0.1} value={element.volume} onBlur={() => {this.saveMediaConfig("audio")}} onChange={(e) => {this.updateVolume(e, index, "audio")}} />
                                            <span style={{width: "50px"}}>{element.volume * 100}%</span>
                                            <button onClick={() => {this.setState({audioPreview: element.url, selectedAudioIndex: index }); document.getElementById("audio-preview").volume = element.volume;}}>Preview</button>
                                        </span>
                                    </li>)
                            })}                       
                        </ul>
                    </div>
                    <div style={{display: "table-cell", visibility: this.state.selectedAudioIndex >= 0 && this.state.selectedAudioIndex < this.state.audioPool.length ? "visible" : "hidden", verticalAlign: "middle"}}>
                        <h3>Preview</h3>
                        <audio 
                            id="audio-preview"
                            src={this.state.audioPreview} 
                            width="300px" 
                            controls 
                            onBlur={() => {this.saveMediaConfig("video")}} />
                    </div>
                </div>
                <div style={{border: "1px solid black"}}>
                    <h3>Add New Audio</h3>
                    <div style={{display: "table"}}>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            <input ref={this.audioDataRef} onChange={(e) => {this.onFileLoaded(e)}} accept=".mp3" type="file" disabled={this.state.addAudioUrl ? true : false} /><br/>
                            <button onClick={() => {this.storeMedia("audio")}} disabled={this.state.uploadAudioData || this.state.addAudioUrl || this.state.saving ? false : true}>Store Audio</button>
                        </div>
                        <div style={{display: "table-cell"}}>
                            {this.state.uploadAudioDataUrl ? <audio src={this.state.uploadAudioDataUrl} width="300px" controls /> : null}
                        </div>
                    </div>
                </div>
                <div style={{display: "table"}}>
                    <div style={{display: "table-cell"}}>
                        <h3>My Video</h3>
                        <ul>
                            { this.state.videoPool.map((element, index) => {
                                if (!element.volume) {
                                    element.volume = 1.0;
                                }

                                return (<li>
                                            <input type="checkbox" onChange={(e) => {this.onDisableMedia(e, "video", index)}} checked={element.enabled} disabled={this.state.saving}/>
                                            <button onClick={() => {this.onDeleteMedia("video", index)}}>X</button>
                                            <select 
                                                defaultValue="none" 
                                                value={element.chromaKey}
                                                onChange={(e) => {this.updateChromaKey(e, index, "video")}}
                                                onBlur={(e) => {this.saveMediaConfig("video")}}>
                                                    <option value="red">Red</option>
                                                    <option value="green">Green</option>
                                                    <option value="blue">Blue</option>
                                                    <option value="black">Black</option>
                                                    <option value="none">No Chroma</option>
                                            </select>
                                            <span className={this.state.videoPreview === element.url  ? "selected" : ""} style={{cursor: "pointer"}}>
                                                <input type="text" value={element.name} onChange={(e) => {this.updateMedia(e, index, "video")}} onBlur={() => {this.saveMediaConfig("video")}} disabled={this.state.saving} />
                                                <input type="range" min={0} max={1} step={0.1} value={element.volume} onBlur={() => {this.saveMediaConfig("video")}} onChange={(e) => {this.updateVolume(e, index, "video")}} />
                                                <span style={{width: "50px"}}>{element.volume * 100}%</span>
                                                <button onClick={() => {this.setState({videoPreview: element.url, selectedVideoIndex: index }); document.getElementById("video-preview").volume = element.volume;}}>Preview</button>
                                            </span>
                                        </li>)
                            })}                        
                        </ul>
                    </div>
                    <div style={{display: "table-cell", visibility: this.state.selectedVideoIndex >= 0 && this.state.selectedVideoIndex < this.state.videoPool.length ? "visible" : "hidden", verticalAlign: "middle"}}>
                        <h3>Preview</h3>
                        <video 
                            id="video-preview"
                            src={this.state.videoPreview} 
                            width="300px" 
                            controls 
                            onBlur={() => {this.saveMediaConfig("video")}} />
                    </div>
                </div>
                <div style={{border: "1px solid black"}}>
                    <h3>Add New Video</h3>
                    <div style={{display: "table"}}>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            <input ref={this.videoDataRef} onChange={(e) => {this.onFileLoaded(e)}} accept=".mp4" type="file" disabled={this.state.addVideoUrl ? true : false} /><br/>
                            <button onClick={() => {this.storeMedia("video")}} disabled={this.state.uploadVideoData || this.state.addVideoUrl || this.state.saving ? false : true}>Store Video</button>
                        </div>
                        <div style={{display: "table-cell"}}>
                            {this.state.uploadVideoDataUrl ? <video src={this.state.uploadVideoDataUrl} width="300px" controls /> : null}
                        </div>
                    </div>
                </div>
                <div style={{display: "table"}}>
                    <div style={{display: "table-cell"}}>
                        <h3>My Animated Gifs</h3>
                        <ul>
                            { this.state.imagePool.map((element, index) => {
                                return (<li>
                                            <button onClick={() => {this.onDeleteMedia("image", index)}}>X</button>
                                            <span className={this.state.imagePreview === element.url  ? "selected" : ""} style={{cursor: "pointer"}}>
                                                <input type="text" value={element.name} onChange={(e) => {this.updateMedia(e, index, "image")}} onBlur={() => {this.saveMediaConfig("image")}} disabled={this.state.saving} />
                                                <button onClick={() => {this.setState({imagePreview: element.url, selectedImageIndex: index });}}>Preview</button>
                                            </span>
                                        </li>)
                            })}                        
                        </ul>
                    </div>
                    <div style={{display: "table-cell", visibility: this.state.selectedImageIndex >= 0 && this.state.selectedImageIndex < this.state.imagePool.length ? "visible" : "hidden", verticalAlign: "middle"}}>
                        <h3>Preview</h3>
                        <img 
                            id="img-preview"
                            src={this.state.imagePreview} 
                            width="300px" />
                    </div>
                </div>
                <div style={{border: "1px solid black"}}>
                    <h3>Add New Gif</h3>
                    <div style={{display: "table"}}>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            <input ref={this.imageDataRef} onChange={(e) => {this.onFileLoaded(e)}} accept=".gif" type="file" /><br/>
                            <button onClick={() => {this.storeMedia("image")}} disabled={this.state.uploadImageData || this.state.saving ? false : true}>Store Gif</button>
                        </div>
                        <div style={{display: "table-cell"}}>
                            {this.state.uploadImageDataUrl ? <img src={this.state.uploadImageDataUrl} width="300px" /> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}