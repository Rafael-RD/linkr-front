import React from "react";
import { NavLink } from "react-router-dom";
import reactStringReplace from "react-string-replace";

export default function HashtagDescription(props) {
  const { description } = props;
  const replacedText = reactStringReplace(description, /#(\w+)/g, (match, i) => (
      <NavLink key={match + i} to={`/hashtag/${match}`} data-test="hashtag">
        #{match}
      </NavLink>
    )
  );
  return <div data-test="description">{replacedText}</div>;
}
