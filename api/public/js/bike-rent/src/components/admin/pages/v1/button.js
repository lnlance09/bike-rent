import "./style.css"
import { Form, Header, Input, Radio, Segment, Select } from "semantic-ui-react"
import { colorOptions } from "utils/selectOptions"
import React, { Fragment } from "react"
import PropTypes from "prop-types"

const EditButton = ({
	basic,
	changeColor,
	changeText,
	color,
	inverted,
	text,
	title,
	toggleBasic,
	toggleInverted,
	toggleVisibility,
	visible
}) => {
	return (
		<Fragment>
			<Header as="h2" attached="top">
				{title}
			</Header>
			<Segment attached basic>
				<Form.Group>
					<Form.Field>
						<label>
							<b>Visible</b>
						</label>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={visible === 1}
							label="Yes"
							name="visible"
							onChange={toggleVisibility}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={visible === 0}
							label="No"
							name="visible"
							onChange={toggleVisibility}
							value="off"
						/>
					</Form.Field>
				</Form.Group>
				<Form.Group>
					<Form.Field>
						<label>
							<b>Basic</b>
						</label>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={basic === 1}
							label="Yes"
							name="basic"
							onChange={toggleBasic}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={basic === 0}
							label="No"
							name="basic"
							onChange={toggleBasic}
							value="off"
						/>
					</Form.Field>
				</Form.Group>
				<Form.Group>
					<Form.Field>
						<label>
							<b>Inverted</b>
						</label>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={inverted === 1}
							label="Yes"
							name="inverted"
							onChange={toggleInverted}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={inverted === 0}
							label="No"
							name="inverted"
							onChange={toggleInverted}
							value="off"
						/>
					</Form.Field>
				</Form.Group>
				<Form.Field>
					<label>Color</label>
					<Select
						onChange={changeColor}
						options={colorOptions}
						placeholder="Select a color"
						value={color}
					/>
				</Form.Field>
				<Form.Field>
					<label>Text</label>
					<Input onChange={changeText} placeholder="Text" value={text} />
				</Form.Field>
			</Segment>
		</Fragment>
	)
}

EditButton.propTypes = {
	basic: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	changeColor: PropTypes.func,
	changeText: PropTypes.func,
	color: PropTypes.string,
	inverted: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	text: PropTypes.string,
	title: PropTypes.string,
	toggleBasic: PropTypes.func,
	toggleInverted: PropTypes.func
}

export default EditButton
