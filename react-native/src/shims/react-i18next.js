import React from "react";

function identityTranslate(value) {
  return value;
}

export function useTranslation() {
  return {
    t: identityTranslate,
    i18n: {
      changeLanguage: async () => {}
    }
  };
}

export function withTranslation() {
  return function wrap(WrappedComponent) {
    function WrappedWithTranslation(props) {
      const { t, i18n } = useTranslation();
      return <WrappedComponent {...props} t={t} i18n={i18n} />;
    }

    WrappedWithTranslation.displayName = `WithTranslation(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
    return WrappedWithTranslation;
  };
}

export function Trans({ children }) {
  return <>{children}</>;
}
