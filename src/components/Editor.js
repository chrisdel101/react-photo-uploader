import React from 'react'
import Slider from './Slider'
import Button from './Button'
import AvatarEditor from 'react-avatar-editor'
import History from './History'
import Uploader from './Uploader'
import Modal from './Modal'
import App from '../App'

class Editor extends React.Component {
	constructor(props) {
		super(props);
		//set all properties to variable initialValues
		let initialValues = {
			width: 300,
			height: 250,
			border: 50,
			color: [
				255, 255, 255, 0.6
			],
			scale: 1.2,
			rotate: 0,
			scaledImage: '',
			show: false
		}
		this.state = {
			//import initialValues variable as state, using key/value pairs as state
			...initialValues,
			index: '',
			//set history as the all the original initialValues and a title
			history: [
				{
					...initialValues,
					title: 'Initial'
				}
			]
		};
		this.indexRef = React.createRef()
	}

	//WHEN CALLED ADDHISTORY BELOW, TAKES IN TITLE TO APPEAR
	//PROPERTIES AND THEIR STATE + TITLE ARE BUNDLED,
	addHistory(title) {
		let state = {
			title,
			color: this.state.color,
			scale: this.state.scale,
			rotate: this.state.rotate
		};
		//CREATE SHALLOW COPY OF THE HISTORY-
		// THIS HAPPENS WHENEVER AN NEW PIECE OF HISTORY HAPPENS
		let history = this.state.history.slice(0);
		// WHENEVER THE HISTORY CHANGES, THE CHANGE IS SLICED OFF AND PUSHED INTO THE HISTORY ARRAY?
		//CREATED IN THIS.STATE

		////title practicing///////////////
		// let current_title;
		var titles = [];
		// comes form the handle method
		titles.push(state.title)

		history.push(state);
		this.setState({history});
		// setstate to the new value of history
	}
    resetHistory(){
        // set to starting values
        let {color, scale, rotate} = {
            color: [255, 255, 255, 0.6],
            scale: 1.2,
            rotate: 0,
        }
        // reset history
        let history = this.state.history.slice(0, 0);
        //change the state to equal those settings
        this.setState({color, scale, rotate, history});
    }

	goBackHistory(index) {
		console.log('index', index)
		// set all the properies to be whatever they were at this point in history
		// console.log('index', index)
		let {color, scale, rotate} = this.state.history[index];

		// then set the history itself to slice from the beginning up until this time -this is how if goes backwards
		let history = this.state.history.slice(0, index);
        console.log(history)
		//change the state to equal those settings
		this.setState({color, scale, rotate, history});
        console.log(history)
	}

	handleScale(event) {
		this.setState({
			...this.state,
			scale: event.target.value
		});
		this.addHistory('Scale changed');
	}

	handleRed(event) {
		let color = this.state.color.slice(0);
		color[0] = parseInt(event.target.value);
		this.setState({
			...this.state,
			color
		});
		this.addHistory('Red changed');
	}
	handleGreen(event) {
		let color = this.state.color.slice(0);
		color[1] = parseInt(event.target.value);
		this.setState({
			...this.state,
			color
		});
		this.addHistory('Green changed');
	}
	handleBlue(event) {
		let color = this.state.color.slice(0);
		color[2] = parseInt(event.target.value);
		this.setState({
			...this.state,
			color
		});
		this.addHistory('Blue changed');
	}
	handleOpacity(event) {
		let color = this.state.color.slice(0);
		color[3] = parseInt(event.target.value)
		this.setState({
			...this.state,
			color
		});
		this.addHistory('Opacity changed');
	}
	handleLeft(event) {
		this.setState({
			rotate: this.state.rotate - 90
		})
		this.addHistory('Rotated Left');
	}
	handleRight(event) {
		this.setState({
			rotate: this.state.rotate + 90
		})
		this.addHistory('Rotated Right');
	}
	//avatar-editor method- put our changed image into this variable
	handlePreview(e) {
        // make sure there is a file uploadedFiles
        if(this.props.uploadedFiles.length <= 0){
            console.log('no image attached')
            return
        }
		const canvasScaled = this.editor.getImageScaledToCanvas();
		//put out final product inside the scaledImage container, made back in initialValues as blank
		//GIVEN THIS ANSWER- call .toDataURL() on this image, returning dataurl represnation of image
        console.log('canvasScaled', e)
		this.setState({scaledImage: canvasScaled.toDataURL()})
        this.showModal()

	}
	//avatar-editor function -  just copied from docs, matches ref in body of component
	setEditorRef(editor) {
		if (editor)
			this.editor = editor
	}

	showModal = () => {
        console.log('open')
		this.setState({show: true});
	}

	hideModal = () => {
        console.log('close')
		this.setState({show: false});
        console.log(this.state.show)
	}

	render() {
		return (<section className="editor">
			<div className="image-editor-container">

				<div className="sliders">
					<Slider text="Zoom" onChange={this.handleScale.bind(this)} value={this.state.scale}/>
					<Slider className="red-color-slider" text="Border Red" onChange={this.handleRed.bind(this)} value={this.state.color[0]}/>
					<Slider className="green-color-slider" text="Border Green" onChange={this.handleGreen.bind(this)} value={this.state.color[1]}/>
					<Slider className="blue-color-slider" text="Border Blue" onChange={this.handleBlue.bind(this)} value={this.state.color[2]}/>
					<Slider className="opacity-color-slider" text="Border Opacity" onChange={this.handleOpacity.bind(this)} value={this.state.color[3]}/>
				</div>
				<div className="buttons">
					<Button className="rotate-left" text="Rotate Left" onClick={this.handleLeft.bind(this)}/>
					<Button className="rotate-right" text="Rotate Right" onClick={this.handleRight.bind(this)}/>
					<Button className="preview" text="Preview" onClick={this.handlePreview.bind(this)}/>
					<Button className="reset" text="Reset" onClick={this.resetHistory.bind(this)}/>
				</div>
				<div className="history-container">
					<input type="checkbox" className="select-checkbox" id="c1"/>
					<label htmlFor="c1" className="select-label">Click to open dropdown</label>
					<div className="select-wrap">
						<ol className="select">
							{
								this.state.history.map((item, i) => {
									return (<li className="history-item" key={i} value={i} onClick={this.goBackHistory.bind(this, i)}>{item.title}
									</li>)
								})
							}
						</ol>

					</div>
				</div>

				{/* <button type="button" onClick={this.showModal}>
					open
				</button> */}
			</div>

			<AvatarEditor
				//bind to setEditorRef function above
				ref={this.setEditorRef.bind(this)}
				//image coming from Dropzone
				image={this.props.file} uploaded={this.props.uploaded} width={this.state.width}
                height={this.state.height} border={this.state.border}
                color={this.state.color}
				// RGBA
				scale={parseInt(this.state.scale)}
                className="avatar-editor" rotate={this.state.rotate}/> {/* scaled image rendered here */}

                <Modal show={this.state.show} handleClose={this.hideModal}>
					<img className="scaledImage" src={this.state.scaledImage}/>
				</Modal>

		</section>)
	}
}

export default Editor
