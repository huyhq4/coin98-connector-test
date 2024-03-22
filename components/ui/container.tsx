interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }: any) => {
  return <div className="mx-auto max-w-7xl px-8 mt-5 pb-20 md:pb-10">{children}</div>;
};

export default Container;
