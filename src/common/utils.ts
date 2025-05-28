export function createReactiveState<T extends Record<string | symbol | number, unknown>>(
  initial: T,
  onChange: (key: keyof T, value: T[keyof T]) => void
): T {
  return new Proxy(initial, {
    set(target, prop, value) {
      onChange(prop, value);
      target[prop as keyof T] = value;
      return true;
    },
  });
}

export function save<T>(key: string, value: T): undefined | Error {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error while trying to save value!", e, { key, value });

    return e;
  }
}

export function load<T>(key: string, deserialise: (value: string) => T): T | undefined {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      console.warn(`No Found: "${key}"!`);
      return;
    }

    const json = JSON.parse(stored);

    return deserialise(json);
  } catch (e) {
    console.error("Error while trying to load value!", e, { key });
    return;
  }
}
