/** SettingCard.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Button used to call the modals for each setting
 */

interface Props {
  title: string;
  onClick: () => void;
}

const SettingCard = (props: Props): JSX.Element => {
  return (
    <div className="Settings__Card" onClick={props.onClick}>
      {props.title}
    </div>
  );
};

export default SettingCard;
