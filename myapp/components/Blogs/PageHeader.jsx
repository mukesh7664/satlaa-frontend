// ./frontend/src/app/[lang]/components/PageHeader.js

import React from "react";
import PropTypes from 'prop-types';

export default function PageHeader({ heading, text }) {
    return (
        <div className="my-16 w-full text-center">
            {text && <span className="text-violet-400 font-bold">{text}</span>}
            <h2 className="text-4xl my-4 lg:text-5xl font-bold font-heading">{heading}</h2>
        </div>
    );
}

PageHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    text: PropTypes.string
};
