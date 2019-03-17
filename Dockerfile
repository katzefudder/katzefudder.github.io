FROM ubuntu:18.04
MAINTAINER flo@katzefudder.de

# Install Basics
RUN apt-get update && apt-get install -y curl ruby ruby-dev build-essential \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc \
  echo 'export GEM_HOME=$HOME/gems' >> ~/.bashrc \
  echo 'export PATH=$HOME/gems/bin:$PATH' >> ~/.bashrc \
  source ~/.bashrc

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get install -yq nodejs build-essential

# fix npm - not the latest version installed by apt-get
RUN npm install -g npm \
  && npm install -g gh

RUN npm install -g gulp-cli && npm install gulp gulp-sass gulp-header gulp-clean-css gulp-rename gulp-minify browser-sync

# Install Gems
#RUN gem install \
#  jekyll \
#  jekyll-feed \
#  minima \
#  bundler

VOLUME /src
EXPOSE 4000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /src

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]
