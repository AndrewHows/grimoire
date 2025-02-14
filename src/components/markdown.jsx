import MarkdownBase from 'react-markdown';
import classes from './markdown.module.css';

export const Markdown = (props) => (
	<MarkdownBase className={classes.markdown} {...props} />
);
