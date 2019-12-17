import React from 'react';
import { Col, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * @desc Name input.
 */
export const promptName = (<InputGroup>
    <InputGroupAddon addonType="prepend">
        <InputGroupText className="adTextBox">
            <FontAwesomeIcon icon={faUser}/>
        </InputGroupText>
    </InputGroupAddon>
    <Input
        id="input"
        autoComplete="off"
        required
        className="textBox"
        type="text"
        name="name"
        placeholder="Name"
    />
</InputGroup>);

/**
 * @desc E-Mail input.
 */
export const promptEmail = (<InputGroup>
    <InputGroupAddon addonType="prepend">
        <InputGroupText className="adTextBox">
            <FontAwesomeIcon icon={faEnvelope}/>
        </InputGroupText>
    </InputGroupAddon>
    <Input
        id="input"
        autoComplete="off"
        required
        className="textBox"
        type="email"
        name="email"
        placeholder="E-Mail"
    />
</InputGroup>);

/**
 * @desc Telephone input.
 */
export const promptTelephone = (<InputGroup>
    <InputGroupAddon addonType="prepend">
        <InputGroupText className="adTextBox">
            <FontAwesomeIcon icon={faPhone}/>
        </InputGroupText>
    </InputGroupAddon>
    <Input
        id="input"
        autoComplete="off"
        required
        className="textBox"
        type="text"
        name="telephone"
        placeholder="Telephone"
    />
</InputGroup>);

/**
 * @desc Current Password, New Password & Confirm Password input.
 */
export const promptPassword = (<div className="container-fluid mx-0">
    <div className="row container-fluid mx-0">
        <Col md={12} className="mb-4">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText className="adTextBox">
                        <FontAwesomeIcon icon={faLock}/>
                    </InputGroupText>
                </InputGroupAddon>
                <Input
                    id="currentPassword"
                    required
                    className="textBox"
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                />
            </InputGroup>
        </Col>
    </div>
    <div className="row container-fluid mx-0">
        <Col md={12} className="mb-4">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText className="adTextBox">
                        <FontAwesomeIcon icon={faKey}/>
                    </InputGroupText>
                </InputGroupAddon>
                <Input
                    id="password"
                    required
                    className="textBox"
                    type="password"
                    name="password"
                    placeholder="New Password"
                />
            </InputGroup>
        </Col>
    </div>
    <div className="row container-fluid mx-0">
        <Col md={12} className="mb-4">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText className="adTextBox">
                        <FontAwesomeIcon icon={faKey}/>
                    </InputGroupText>
                </InputGroupAddon>
                <Input
                    id="confirmPassword"
                    required
                    className="textBox"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                />
            </InputGroup>
        </Col>
    </div>
</div>);