import styles from './select.module.css';

export interface ISelectItem {
  label: string;
  value: string;
  key: string;
}

export interface ISelectProps {
  onChange: (string) => void;
  item: string;
  items: Array<string>;
  label: string;
}

export default function Select(props: ISelectProps) {
  const onChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <div className={styles.selectWrapper}>
      <label className={styles.label}>{props.label}</label>
      <select
        className={styles.socialDropdown}
        onChange={onChange}
        value={props.item}
      >
        {props.items.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
