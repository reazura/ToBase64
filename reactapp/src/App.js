import React, { Component } from 'react';

export default class App extends Component {
	    static displayName = App.name;

	    constructor(props) {
			super(props);
			this.serverEncode = this.serverEncode.bind(this);
			this.cancelEncode = this.cancelEncode.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.state = { input: '', response: '', loading: false };
	    }

	    handleChange(event) { this.setState({ input: event.target.value }); }

	    render() {
			return (
				    <div>
						<div>
							    <input placeholder="input" value={this.state.input} onChange={this.handleChange} />
							    <input type="button" value={this.state.loading ? 'Cancel' : 'Convert'} onClick={this.state.loading ? this.cancelEncode : this.serverEncode} />
							    <input value={this.state.response} readOnly />
						</div>
				    </div>
			);
	    }

	    async cancelEncode() {
			var component = this;
			component.state.eventSource.close();
			component.setState({ loading: false, eventSource: null });
	    }

	    async serverEncode() {
			var component = this;
			var source = new EventSource('/encoder?input=' + component.state.input);
			component.setState({ response: '', loading: true, eventSource: source });

			source.onopen = function (event) {
				    component.setState({ response: component.state.response + event.data, loading: true });
			};

			source.onmessage = function (event) {
				    component.setState({ response: component.state.response + event.data, loading: true });
			};

			source.onerror = function (event) {
				    component.setState({ loading: false });
				    source.close();
			}

	    }
}
