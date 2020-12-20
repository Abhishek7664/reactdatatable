import React from "react";

export const PaginationComponent = ({
  activepage = 1,
  totalpage,
  handleChange,
  paginationImg={ doubleLeftImg: "", leftImg: "", rightImg: "", doubleRightImg: "" }
}) => {
  let paginationArr = [];

  let disabled = activepage === 1 ? true : false;
  paginationArr.push({
    activepage: 1,
    title: "«",
    active: false,
    disabled,
    label: paginationImg && paginationImg.dleft_tooltip ? paginationImg.dleft_tooltip : "First Page",
    image: paginationImg && paginationImg.doubleLeftImg ? paginationImg.doubleLeftImg : "img/icons-double-left-100.png",
    className: "border_none",
  });
  paginationArr.push({
    activepage: activepage - 1,
    title: "‹",
    active: false,
    disabled,
    label: paginationImg && paginationImg.left_tooltip ? paginationImg.left_tooltip : "Previous Page",
    image: paginationImg && paginationImg.leftImg ? paginationImg.leftImg : "img/icons-left-100.png",
    className: "border_none",
  });
  for (let i = 1; i <= totalpage; i++) {
    let active = activepage === i ? true : false;
    disabled = false;
    if (activepage - 4 === i) {
      paginationArr.push({
        activepage,
        title: "..",
        active,
        disabled: true,
      });
    }
    if (activepage - 4 >= i) {
    } else if (i < activepage + 4) {
      paginationArr.push({ activepage: i, title: i, active, disabled });
    }
    if (i === activepage + 4) {
      paginationArr.push({
        activepage,
        title: "..",
        active,
        disabled: true,
      });
    }
  }
  disabled = activepage === totalpage ? true : false;
  paginationArr.push({
    activepage: activepage + 1,
    title: "›",
    active: false,
    disabled,
    label: paginationImg && paginationImg.right_tooltip ? paginationImg.right_tooltip : "Next Page",
    image: paginationImg && paginationImg.rightImg ? paginationImg.rightImg : "img/icons-right-100.png",
    className: "border_none"
  });
  paginationArr.push({
    activepage: totalpage,
    title: "»",
    active: false,
    disabled,
    label: paginationImg && paginationImg.dright_tooltip ? paginationImg.dright_tooltip : "Last Page",
    image: paginationImg && paginationImg.doubleRightImgimg ? paginationImg.doubleRightImgimg : "img/icons-double-right-100.png",
    className: "border_none",
  });

  return (
    <ul className="pagination_ul">
      {paginationArr.map((el, key) => {
        let liclass = el.active ? "active " : "";
        liclass += el.disabled ? "disabled " : "";
        liclass += el.className ? el.className : "";
        return (
          <li
            key={key}
            className={liclass + " page_li"}
            title={el.label ? el.label : ""}
            onClick={() => {
              if (!el.disabled && handleChange) {
                handleChange(el.activepage);
              }
            }}
          >
            {el.image ? (
              <img alt={el.label} src={el.image} height={15} />
            ) : (
              el.title
            )}
          </li>
        );
      })}
    </ul>
  );
};
