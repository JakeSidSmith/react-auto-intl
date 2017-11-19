import * as React from 'react';
import { LOOKUP_TABLE } from '../constants';

const TITLE = 'Hello, World!';
const VARIABLE = 'variable';

interface State {
  value: boolean;
  placeholder: string;
  lookupValue: keyof typeof LOOKUP_TABLE;
}

export default class App extends React.Component<{}, State> {
  public constructor (props: any) {
    super(props);

    this.state = {
      value: true,
      placeholder: 'Placeholder',
      lookupValue: 'b',
    };
  }

  public render () {
    const { value, placeholder, lookupValue } = this.state;

    return (
      <div>
        <h1>
          {TITLE}
        </h1>
        <p>
          Click <a href="#" title="Link to place">here</a> to go to a link.
        </p>
        <input type="submit" value="Button text" placeholder={value ? placeholder : ''} />
        Text with a {VARIABLE} in the middle.
        {this.getValueText()}
        {LOOKUP_TABLE[lookupValue]}
      </div>
    );
  }

  private getValueText = () => {
    if (this.state.value) {
      return `The value is ${this.state.value}`;
    }

    return 'The value in not true';
  }
}
