import React from "react";
import { NavLink } from "react-router-dom";

export default function HashtagDescription(props) {
  const { description } = props;
  const fragments = description.split(" ");
  const filteredArr = [];
  let aux = "";
  fragments.forEach((f, index) => {
    if (f.includes("#")) {
      if (aux) {
        filteredArr.push(aux);
        aux = "";
      }
      const value = index === fragments.length - 1 ? f : `${f} `;
      filteredArr.push(value);
    } else {
      aux += `${f} `;
    }
  });
  if(aux.length>0) filteredArr.push(aux);
  return (
    <p data-test="description">
      {filteredArr.map((fragment, index) => {
        if (fragment.includes("#")) {
          const hashtag = fragment.substring(1);
          return (
            <NavLink key={index} to={`/hashtag/${hashtag}`}>
              {fragment}
            </NavLink>
          );
        } else {
          return <React.Fragment key={index}>{fragment}</React.Fragment>;
        }
      })}
    </p>
  );
}
